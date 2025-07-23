import React from 'react';

//provide a loading state placeholder that mimics the layout of the book
const BookCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
      <div className="p-4">
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default BookCardSkeleton;