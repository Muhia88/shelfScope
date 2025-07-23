import React from 'react';

//displays a visual progress bar
const ProgressBar = ({ progress }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 font-medium">Reading Progress</span>
        <span className="text-blue-600 font-bold">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;