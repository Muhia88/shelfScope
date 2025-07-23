// src/pages/AuthorPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookCard from '../components/BookCard';
import BookCardSkeleton from '../components/BookCardSkeleton';

const AuthorPage = () => {
  const { authorName } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://gutendex.com/books?search=${encodeURIComponent(authorName)}`);
        const data = await response.json();
        setBooks(data.results);
      } catch (err) {
        setError("Failed to fetch author's books");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuthorBooks();
  }, [authorName]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Books by {decodeURIComponent(authorName)}</h1>
      
      {error && <div className="text-center text-red-500 py-10">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))
        ) : books.length === 0 ? (
          <p className="col-span-full text-center">No books found for this author.</p>
        ) : (
          books.map(book => (
            <BookCard key={book.id} book={book} />
          ))
        )}
      </div>
    </div>
  );
};

export default AuthorPage;