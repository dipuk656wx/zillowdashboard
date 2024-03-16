import React, { useState } from 'react';

const UploadExcel = () => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const response = await fetch('/realtor/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setUploadStatus('success');
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('error');
    }
  };

  const resetUploadStatus = () => {
    setUploadStatus(null);
  };

  return (
    <div className="flex bg-gray-900 flex-col items-center justify-center h-screen">
      <label htmlFor="excelFile" className="cursor-pointer flex items-center space-x-2 bg-gray-100 rounded-md p-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Upload Excel File</span>
        <input
          type="file"
          id="excelFile"
          className="hidden"
          accept=".xlsx"
          onChange={handleFileChange}
        />
      </label>
      {uploadStatus === 'success' && (
        <div className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
          File uploaded successfully!
          <button onClick={resetUploadStatus} className="ml-2 text-sm font-semibold underline">Dismiss</button>
        </div>
      )}
      {uploadStatus === 'error' && (
        <div className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Error uploading file. Please try again.
          <button onClick={resetUploadStatus} className="ml-2 text-sm font-semibold underline">Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default UploadExcel;
