import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AudioBookCardSkeleton from './AudioBookCardSkeleton';

const AudioBookCard = ({ audiobook }) => {
  const [coverUrl, setCoverUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCover = async () => {
      setLoading(true);
      if (audiobook.title) {
        try {
          // Constructs the target URL for the Open Library search API.
          const targetUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(audiobook.title)}`;
          // Constructs the URL for the proxy Cloud Function.
          const proxyUrl = `https://us-central1-test-proj-1-825b7.cloudfunctions.net/getOpenLibraryData?url=${encodeURIComponent(targetUrl)}`;
          
          const response = await fetch(proxyUrl);
          const data = await response.json();

          if (data.docs && data.docs[0] && data.docs[0].cover_i) {
            setCoverUrl(`https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`);
          } else {
            setCoverUrl('/image-placeholder.jpg');
          }
        } catch (error) {
          console.error("Failed to fetch book cover", error);
          setCoverUrl('/image-placeholder.jpg');
        }
      } else {
         setCoverUrl('/image-placeholder.jpg');
      }
      setLoading(false);
    };
    fetchCover();
  }, [audiobook.title]);

  if (loading) {
    return <AudioBookCardSkeleton />;
  }

  const author = audiobook.authors?.[0]?.last_name ? `${audiobook.authors[0].first_name} ${audiobook.authors[0].last_name}` : 'Unknown Author';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <Link to={`/audiobook/${audiobook.id}`}>
        <img 
          src={coverUrl} 
          alt={audiobook.title} 
          className="w-full h-64 object-cover bg-gray-200"
        />
      </Link>
      <div className="p-4">
        <h3 className="font-bold text-lg truncate" title={audiobook.title}>{audiobook.title}</h3>
        <p className="text-gray-600 text-sm">
          by {author}
        </p>
      </div>
    </div>
  );
};

export default AudioBookCard;