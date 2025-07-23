import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AudioBookCard from '../../components/AudioBookCard';
import AudioBookCardSkeleton from '../../components/AudioBookCardSkeleton';

const popularTags = ['Poetry', 'Fiction', "Children's Fiction", 'Historical Fiction', 'General Fiction', 'Science fiction', 'Action & Adventure Fiction'];

// allows users to discover audiobooks by Browse popular genres
const DiscoverAudioBooks = () => {
  const { genre } = useParams();
  const [audiobooks, setAudiobooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!genre) {
        setLoading(false);
        setAudiobooks([]);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const targetUrl = `https://librivox.org/api/feed/audiobooks/?format=json&genre=${encodeURIComponent(genre)}`;
        const proxyUrl = `https://us-central1-test-proj-1-825b7.cloudfunctions.net/getLibrivoxData?url=${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(proxyUrl);
        if(!response.ok) throw new Error(`Error fetching data for genre: ${genre}`);
        
        const data = await response.json();
        setAudiobooks(data.books || []);

      } catch (err) {
        setError('Failed to fetch audiobooks. Please try another genre.');
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
          {genre ? `Discover: ${genre}` : 'Discover Audiobooks'}
        </h1>
        <p className="text-gray-600 mt-2">
          Browse audiobooks by genre.
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Popular Genres
        </h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag}
              to={`/discover-audiobooks/${tag}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                genre === tag
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
      
      {error && <div className="text-center text-red-500 py-4">{error}</div>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          genre && Array.from({ length: 8 }).map((_, index) => (
            <AudioBookCardSkeleton key={index} />
          ))
        ) : (
          audiobooks.map(book => (
            <AudioBookCard key={book.id} audiobook={book} />
          ))
        )}
      </div>
    </div>
  );
};

export default DiscoverAudioBooks;