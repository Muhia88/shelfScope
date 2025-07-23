import React from 'react';

// responsible for displaying the text content of a book
const BookReader = ({ pages, currentPage, onPageChange, totalPages, isLoading }) => {

  const goToNextPage = () => {
    onPageChange(Math.min(currentPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    onPageChange(Math.max(currentPage - 1, 1));
  };
  
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-inner flex flex-col items-center justify-center h-[32rem]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading book content...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold mb-4">Read the Book</h2>
      
      <div className="mb-4 text-center">
        <p className="text-gray-600">Page {currentPage} of {totalPages}</p>
      </div>

      <div className="h-96 overflow-y-auto p-4 border rounded whitespace-pre-wrap font-serif leading-relaxed">
        {pages[currentPage - 1]}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage <= 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          &larr; Previous
        </button>
        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

export default BookReader;