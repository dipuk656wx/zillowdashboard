import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface Item {
    name: string;
    phoneNumber: string;
    profileLink: string;
    zipCode: string;
    created_at: string;
    updated_at: string;
}

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");
    const by = searchParams.get("by") || null;
    const [data, setData] = useState<Item[] | null>(null);
    const [error, setError] = useState<Boolean>(false);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [showMessageBox, setShowMessageBox] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [SendStatus, setSendStatus] = useState<string | null>(null);
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/realtor/find?by=${by}&keyword=${keyword}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const fetchedData: Item[] = await response.json();
                setData(fetchedData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(true);
            }
        };

        fetchData();
    }, [keyword, by]);

    if (error) {
        return (
            <div>Error, Try Again</div>
        );
    }

    if (data === null) {
        return <div>Loading...</div>;
    }
    const handleMessageSend = async () => {
        const convertedPhoneNumbers = selectedRows.map(phone => {
            const numericPhone = phone.replace(/\D/g, '');
            const formattedPhone = `+1${numericPhone}`;
            return formattedPhone;
        });
        const bodyData = { "message": message, "numbers": convertedPhoneNumbers };
        try {
            const response = await fetch('/realtor/sendMessage', {
                method: 'POST',
                body: JSON.stringify(bodyData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                setSendStatus('success');
            } else {
                setSendStatus('error');
            }
        } catch (error) {
            console.error('Error Sending file:', error);
            setSendStatus('error');
        }
    };
    const handleCheckboxClick = (phoneNumber: string) => {
        if (selectedRows.includes(phoneNumber)) {
            setSelectedRows(selectedRows.filter(row => row !== phoneNumber));
        } else {
            setSelectedRows([...selectedRows, phoneNumber]);
        }
    };
    return (
        <div className="container mx-auto">
            {SendStatus === 'success' && (
                <div className="bg-green-100 text-green-900 p-4 mb-4 rounded">
                    Message sent successfully!
                    <button
                        className="absolute top-0 right-0 p-2"
                        onClick={() => setSendStatus(null)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            )}
            {SendStatus === 'error' && (
                <div className="bg-red-100 text-red-900 p-4 mb-4 rounded">
                    Error sending message. Please try again later.
                    <button
                        className="absolute top-0 right-0 p-2"
                        onClick={() => setSendStatus(null)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            )}
            <h2 className="text-2xl font-bold mb-4">Search Result</h2>
            <div className="mb-4">
                <p className="font-semibold">By: {by}</p>
                <p className="font-semibold">Keyword: {keyword}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Link</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zip Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        className='w-[10px] h-[10px]'
                                        type="checkbox"
                                        checked={selectedRows.includes(item.phoneNumber)}
                                        onChange={() => handleCheckboxClick(item.phoneNumber)}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.phoneNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap"><a href={item.profileLink} target='_blank' rel="noopener noreferrer">{item.profileLink}</a></td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.zipCode}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(item.updated_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="fixed bottom-4 right-4">
                <button onClick={() => setShowMessageBox(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                </button>
            </div>
            {showMessageBox && (
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full h-24 border-gray-300 border rounded-md p-2" placeholder="Enter your message..."></textarea>
                    <button onClick={() => setShowMessageBox(false)} className="absolute top-0 right-0 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <button onClick={handleMessageSend} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-2">Send</button>
                </div>
            )}
        </div>
    );

};

export default SearchResult;
