// src/pages/listen/AudioBookDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteField, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import AudioPlayer from '../../components/AudioPlayer';

const AudioBookDetail = ({ user }) => {
  const { audioBookId } = useParams();
  const [audiobook, setAudiobook] = useState(null);
  const [coverUrl, setCoverUrl] = useState('/image-placeholder.jpg');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInList, setIsInList] = useState(false);

  // Player State
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [savedTime, setSavedTime] = useState(0);
  
  const playerRef = useRef(null);

  useEffect(() => {
    const fetchAudioBook = async () => {
      try {
        setLoading(true);
        const targetUrl = `https://librivox.org/api/feed/audiobooks/?id=${audioBookId}&format=json&extended=1`; // Use extended format for tracks
        const proxyUrl = `https://us-central1-test-proj-1-825b7.cloudfunctions.net/getLibrivoxData?url=${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('Failed to fetch audiobook from server.');

        const data = await response.json();
        const bookData = data.books?.[0];

        if (bookData) {
          setAudiobook(bookData);
          // Fetch cover image
          const coverTargetUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(bookData.title)}`;
          const coverProxyUrl = `https://us-central1-test-proj-1-825b7.cloudfunctions.net/getOpenLibraryData?url=${encodeURIComponent(coverTargetUrl)}`;
          const coverResponse = await fetch(coverProxyUrl);
          const coverData = await coverResponse.json();
          if (coverData.docs && coverData.docs[0] && coverData.docs[0].cover_i) {
            setCoverUrl(`https://covers.openlibrary.org/b/id/${coverData.docs[0].cover_i}-L.jpg`);
          }
        } else {
          throw new Error('Audiobook not found.');
        }

        if (user && bookData) {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const listenList = userDoc.data().listenList || {};
            setIsInList(!!listenList[audioBookId]);
            if (listenList[audioBookId]) {
              setCurrentTrackIndex(listenList[audioBookId].currentTrackIndex || 0);
              setSavedTime(listenList[audioBookId].currentTime || 0);
            }
          }
        }
      } catch (err) {
        setError('Failed to fetch audiobook details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudioBook();
  }, [audioBookId, user]);
  
  const toggleListenList = async () => {
    if (!user || !audiobook) return;
    const userRef = doc(db, 'users', user.uid);

    if (isInList) {
      await updateDoc(userRef, {
        [`listenList.${audioBookId}`]: deleteField()
      });
    } else {
      const audioBookData = {
        id: audiobook.id,
        title: audiobook.title,
        authors: audiobook.authors,
        currentTrackIndex: 0,
        currentTime: 0,
      };
      await setDoc(userRef, { listenList: { [audioBookId]: audioBookData } }, { merge: true });
    }
    setIsInList(!isInList);
  };
  
  const saveProgress = async (currentTime) => {
    if (user && isInList) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        [`listenList.${audioBookId}.currentTrackIndex`]: currentTrackIndex,
        [`listenList.${audioBookId}.currentTime`]: currentTime,
      });
      alert('Progress saved!');
    } else {
      alert('Add the audiobook to your list to save progress.');
    }
  };

  if (loading) return <div className="text-center py-10">Loading audiobook...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!audiobook) return <div className="text-center py-10">Audiobook not found.</div>;

  const author = audiobook.authors?.[0]?.last_name ? `${audiobook.authors[0].first_name} ${audiobook.authors[0].last_name}` : 'Various';
  const currentTrack = audiobook.sections?.[currentTrackIndex];

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/4">
          <img src={coverUrl} alt={audiobook.title} className="w-full rounded-lg shadow-lg bg-gray-200" />
        </div>
        <div className="md:w-3/4">
          <h1 className="text-4xl font-bold">{audiobook.title}</h1>
          <p className="text-xl text-gray-700">by {author}</p>
          <p className="mt-4 text-gray-600" dangerouslySetInnerHTML={{ __html: audiobook.description }} />
          
          <div className="mt-6 flex space-x-4">
            <button onClick={toggleListenList} className={`px-6 py-2 rounded-full font-semibold ${isInList ? 'bg-red-500 text-white' : 'bg-purple-500 text-white'}`}>
              {isInList ? 'Remove from My Listens' : 'Add to My Listens'}
            </button>
            <button onClick={() => playerRef.current?.saveCurrentTime()} className="px-6 py-2 rounded-full bg-yellow-500 text-white">
              Save Progress
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Player</h2>
            {currentTrack ? (
                <div>
                    <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
                    <AudioPlayer 
                      ref={playerRef}
                      audioUrl={currentTrack.listen_url}
                      startTime={savedTime}
                      onSave={saveProgress}
                    />
                </div>
            ) : (
                <p>No tracks available for this audiobook.</p>
            )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Chapters</h2>
            <ul className="h-96 overflow-y-auto">
                {audiobook.sections && audiobook.sections.map((track, index) => (
                    <li key={track.id} 
                        onClick={() => {
                          setCurrentTrackIndex(index);
                          setSavedTime(0);
                        }}
                        className={`p-3 rounded cursor-pointer ${currentTrackIndex === index ? 'bg-purple-100' : 'hover:bg-gray-100'}`}
                    >
                        {track.title}
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default AudioBookDetail;