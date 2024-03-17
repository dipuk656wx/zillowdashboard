const express = require("express");
const Realtor = require("../models/realtor");
const multer = require('multer');
const xlsx = require('xlsx');
const router = express.Router();
const upload = multer();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio_client = require('twilio')(accountSid, authToken);
const senderNumber = process.env.SENDERMOBILENUMBER;
twilio_client.api.accounts(accountSid)
  .fetch()
  .then(account => {
    console.log('Twilio authentication successful. Account SID:', account.sid);
  })
  .catch(error => {
    console.error('Twilio authentication failed:', error);
  });
router.get("/find", async (req, res) => {
    try {
        const { by, keyword } = req.query;

        if (!by || !keyword) {
            return res.status(400).json({ error: 'Missing query parameters' });
        }

        let condition = {};
        condition[by] = { $regex: keyword, $options: 'i' };

        const result = await Realtor.find(condition);
        res.json(result);
    } catch (error) {
        console.error('Error finding realtors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/upload', upload.single('excelFile'), async(req, res) => {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const filename = req.file.originalname;
    const zipCode = filename.substring(0, filename.lastIndexOf('.'));
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    let dataToUpload = [];
    data.forEach((item) => {
        let oneRealtorData = {
            "name": item.Name,
            "phoneNumber": item['Mobile Number'],
            "profileLink": item['Profile Link'],
            "zipCode": zipCode
        };
        dataToUpload.push(oneRealtorData); 
    });
    try {
        const savedRealtors = await Realtor.insertMany(dataToUpload);
        console.log(`Data from file ${filename} saved successfully.`);
        res.status(200).send('File uploaded and processed.');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Internal server error.');
    }
});
router.post("/sendMessage", async (req, res) => {
    const { message, numbers } = req.body;
    try {
        const promises = numbers.map(number => {
            return twilio_client.messages.create({
                from: senderNumber,
                body: message,
                to: number
            });
        });

        Promise.all(promises)
            .then(messages => {
                messages.forEach(message => console.log(message.sid));
                res.status(200).send('Messages sent successfully.');
            })
            .catch(error => {
                console.error('Error sending messages:', error);
                res.status(500).send('Error sending messages.');
            });
    } catch (error) {
        console.error('Error sending messages:', error);
        res.status(500).send('Error sending messages.');
    }
});

module.exports = router;