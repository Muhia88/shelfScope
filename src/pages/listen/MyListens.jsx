// src/pages/listen/MyListens.jsx
import React, { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import AudioBookCard from '../../components/AudioBookCard';
import { Link } from 'react-router-dom';

const MyListens = ({ user }) => {
  const [listenList, setListenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListenList = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const list = userDoc.data().listenList || {};
          const audiobooks = Object.values(list);
          setListenList(audiobooks);
        }
      } catch (err) {
        setError('Failed to fetch your listens');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListenList();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Listens</h1>
      </div>

      {listenList.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Your listen list is empty</h3>
          <p className="text-gray-600 mb-4">
            Start adding audiobooks to see them here.
          </p>
          <Link
            to="/discover-audiobooks"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-medium transition duration-200"
          >
            Discover Audiobooks
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listenList.map((audiobook) => (
            <AudioBookCard key={audiobook.id} audiobook={audiobook} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListens;

