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

    return (
        <div className="container mx-auto">
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
        </div>
    );
};

export default SearchResult;
