const express = require("express");
const Realtor = require("../models/realtor");
const multer = require('multer');
const xlsx = require('xlsx');
const router = express.Router();
const upload = multer();


router.get("/find", async (req, res) => {
    try {
        const { by, keyword } = req.query;

        if (!by || !keyword) {
            return res.status(400).json({ error: 'Missing query parameters' });
        }

        let condition = {};
        condition[by] = { $regex: keyword, $options: 'i' };

        const result = await Realtor.find(condition);
        console.log(result);
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


module.exports = router;