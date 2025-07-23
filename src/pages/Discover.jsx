import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import BookCardSkeleton from '../components/BookCardSkeleton';

const popularTags = [
  { name: 'Science Fiction', emoji: '🚀' },
  { name: 'Fantasy', emoji: '🧙' },
  { name: 'Detective', emoji: '🕵️' },
  { name: 'Gothic Fiction', emoji: '🏰' },
  { name: 'Sea Stories', emoji: '⛵' },
  { name: 'Mythology', emoji: '✨' },
  { name: 'Poetry', emoji: '✒️' },
  { name: 'Philosophy', emoji: '🤔' },
  { name: 'Children\'s Literature', emoji: '🧸' },
  { name: 'Adventure', emoji: '🗺️' },
];

//allows users to discover books by Browse popular genres
const Discover = () => {
  const { genre } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const topic = genre || 'popular';
        const url = `https://gutendex.com/books?topic=${topic.toLowerCase().replace(/\s+/g, '_')}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        setBooks(data.results || []);
      } catch (err) {
        setError('Failed to fetch books');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [genre]);
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {genre ? `Discover ${genre}` : 'Discover Books'}
        </h1>
        <p className="text-gray-600 mt-2">
          {genre 
            ? `Explore popular books in the ${genre} genre` 
            : 'Browse books by genre'}
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Popular Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag.name}
              to={`/discover/${tag.name}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                genre === tag.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag.name} {tag.emoji}
            </Link>
          ))}
        </div>
      </div>
      
      {error && <div className="text-center text-red-500">{error}</div>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))
        ) : (
          books.map(book => (
            <BookCard key={book.id} book={book} />
          ))
        )}
      </div>
    </div>
  );
};

export default Discover;