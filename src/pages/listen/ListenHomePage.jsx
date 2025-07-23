import React, { useState, useEffect } from 'react';
import AudioBookCard from '../../components/AudioBookCard';
import AudioBookCardSkeleton from '../../components/AudioBookCardSkeleton';

//serves as the main page for the "Listen" section
const ListenHomePage = () => {
  const [recentAudioBooks, setRecentAudioBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentAudioBooks = async () => {
      try {
        setLoading(true);
        const targetUrl = 'https://librivox.org/api/feed/audiobooks/?sort_order=catalog_date_desc&limit=10&format=json';
        const proxyUrl = `https://us-central1-test-proj-1-825b7.cloudfunctions.net/getLibrivoxData?url=${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(proxyUrl);
        const data = await response.json();
        setRecentAudioBooks(data.books || []);
      } catch (err) {
        setError('Failed to fetch recent audiobooks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentAudioBooks();
  }, []);

  return (
    <div>
      <div className="text-center my-8">
        <h1 className="text-4xl font-bold mb-4">Listen to Timeless Classics</h1>
        <p className="text-lg text-gray-600">
          Explore thousands of free audiobooks.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Recently Added Audiobooks</h2>
      
      {error && <div className="text-center text-red-500">{error}</div>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <AudioBookCardSkeleton key={index} />
          ))
        ) : (
          recentAudioBooks.map(book => (
            <AudioBookCard key={book.id} audiobook={book} />
          ))
        )}
      </div>
    </div>
  );
};

export default ListenHomePage;