import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import BookCardSkeleton from '../components/BookCardSkeleton';

//serves as the main landing page for the "Read" section
const Home = () => {
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://gutendex.com/books/?sort=popular');
        const data = await response.json();
        setPopularBooks(data.results);
      } catch (err) {
        setError('Failed to fetch popular books');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPopularBooks();
  }, []);

  return (
    <div>
      <div className="text-center my-8">
        <h1 className="text-4xl font-bold mb-4">Discover Your Next Favorite Book</h1>
        <p className="text-lg text-gray-600">
          Explore thousands of free books.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Popular Books</h2>
      
      {error && <div className="text-center text-red-500">{error}</div>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))
        ) : (
          popularBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;