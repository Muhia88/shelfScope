// src/pages/listen/AudioBookSearchResults.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AudioBookCard from '../../components/AudioBookCard';
import AudioBookCardSkeleton from '../../components/AudioBookCardSkeleton';

const AudioBookSearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  const [audiobooks, setAudiobooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setAudiobooks([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        // Search by title, author, and genre (using Librivox 'since' parameter for a broad search)
        const targetUrl = `https://librivox.org/api/feed/audiobooks/?title=${encodeURIComponent(searchQuery)}&format=json`;
        const proxyUrl = `https://us-central1-test-proj-1-825b7.cloudfunctions.net/getLibrivoxData?url=${encodeURIComponent(targetUrl)}`;

        const response = await fetch(proxyUrl);
        const data = await response.json();
        setAudiobooks(data.books || []);

      } catch (err) {
        setError('Failed to fetch search results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [searchQuery]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Search Results for: <span className="text-purple-600">"{searchQuery}"</span>
      </h1>
      
      {error && <div className="text-center text-red-500 py-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <AudioBookCardSkeleton key={index} />
          ))
        ) : audiobooks.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">No audiobooks found for your search.</p>
        ) : (
          audiobooks.map(book => (
            <AudioBookCard key={book.id} audiobook={book} />
          ))
        )}
      </div>
    </div>
  );
};

export default AudioBookSearchResults;