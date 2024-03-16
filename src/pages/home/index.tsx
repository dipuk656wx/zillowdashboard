import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();
    const selectRef = useRef<HTMLSelectElement>(null);

    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = () => {
        const by = selectRef.current?.value;
        if (by && searchInput.trim()) {
            navigate(`/searchResult?by=${by}&keyword=${encodeURIComponent(searchInput.trim())}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-8">Welcome to Zillow Dashboard</h1>
            <div className="flex items-center w-full max-w-md mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    onKeyDown={handleEnter}
                    className="w-full px-4 py-2 h-[42px] text-gray-900 bg-white rounded-l-md focus:outline-none focus:border-blue-400"
                />
                <select
                    ref={selectRef}
                    className="px-4 py-2 h-[42px] border-1 border- text-gray-900 bg-white rounded-r-md focus:outline-none"
                >
                    <option value="name">Name</option>
                    <option value="zipCode">Zip Code</option>
                    <option value="profileLink">Profile Link</option>
                    <option value="phoneNumber">Mobile Number</option>
                </select>
            </div>
            <button onClick={handleSearch} className="w-full max-w-md px-4 py-2 mb-4 text-lg font-semibold text-white bg-blue-500 rounded-md focus:outline-none hover:bg-blue-600">
                Search Data
            </button>
            <button onClick={() => navigate("/upload")} className="w-full my-3 max-w-md px-4 py-2 text-lg font-semibold text-white bg-blue-500 rounded-md focus:outline-none hover:bg-blue-600">
                Upload Data
            </button>
        </div>
    );
};

export default Home;
