import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteField, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import BookReader from '../components/BookReader';
import ProgressBar from '../components/ProgressBar';

const BookDetail = ({ user }) => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true); // For initial book details
  const [textLoading, setTextLoading] = useState(true); // For book text content
  const [error, setError] = useState(null);
  const [isInList, setIsInList] = useState(false);
  
  // Reading progress state
  const [currentPage, setCurrentPage] = useState(1);
  const [highestPageReached, setHighestPageReached] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const CLOUD_FUNCTION_URL = 'https://us-central1-test-proj-1-825b7.cloudfunctions.net/getBookText';

  // Effect for fetching book metadata and user data first
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch book metadata
        const bookResponse = await fetch(`https://gutendex.com/books/${bookId}`);
        if (!bookResponse.ok) {
          throw new Error(`HTTP error! Status: ${bookResponse.status}`);
        }
        const bookData = await bookResponse.json();
        setBook(bookData);

        // Fetch user data
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const readingList = userDoc.data().readingList || {};
            setIsInList(!!readingList[bookId]);
            const savedPage = readingList[bookId]?.highestPageReached || 1;
            setCurrentPage(savedPage);
            setHighestPageReached(savedPage);
          }
        }
      } catch (err) {
        setError('Failed to fetch book details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [bookId, user]);

  // Effect for fetching and processing the book text after metadata is loaded
  useEffect(() => {
    if (!book) return; // Don't fetch text until book metadata is available

    const fetchText = async () => {
      try {
        setTextLoading(true);
        if (book.formats) {
          const textUrl = book.formats['text/plain; charset=us-ascii'] || book.formats['text/plain'];
          if (textUrl) {
            const proxyUrl = `${CLOUD_FUNCTION_URL}?url=${encodeURIComponent(textUrl)}`;
            const textResponse = await fetch(proxyUrl);
            if (!textResponse.ok) {
              throw new Error(`Failed to fetch book text via proxy: ${textResponse.status}`);
            }
            const textData = await textResponse.text();
            
            const words = textData.split(/\s+/);
            const wordsPerPage = 300;
            const numPages = Math.ceil(words.length / wordsPerPage);
            setTotalPages(numPages);
            
            const paginatedText = [];
            for (let i = 0; i < numPages; i++) {
              paginatedText.push(words.slice(i * wordsPerPage, (i + 1) * wordsPerPage).join(' '));
            }
            setPages(paginatedText);
            
          } else {
            setPages(['Book text not available in plain text format.']);
            setTotalPages(1);
          }
        } else {
          setPages(['Book text not available.']);
          setTotalPages(1);
        }
      } catch (err) {
        setError('Failed to fetch book content.');
        console.error(err);
      } finally {
        setTextLoading(false);
      }
    };
    
    fetchText();
  }, [book, CLOUD_FUNCTION_URL]);


  useEffect(() => {
    if (currentPage > highestPageReached) {
      setHighestPageReached(currentPage);
    }
  }, [currentPage, highestPageReached]);

  const saveProgress = async () => {
    if (user && isInList) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        [`readingList.${bookId}.highestPageReached`]: highestPageReached,
        [`readingList.${bookId}.progress`]: Math.round((highestPageReached / totalPages) * 100),
      });
      alert('Progress saved!');
    } else {
      alert('Add the book to your list to save progress.');
    }
  };
  
  const toggleReadingList = async () => {
    if (!user) {
        alert("Please sign in to manage your list.");
        return;
    }
    const userRef = doc(db, 'users', user.uid)
    
    if (isInList) {
      await updateDoc(userRef, {
        [`readingList.${bookId}`]: deleteField()
      })
    } else {
      const bookData = {
        id: book.id,
        title: book.title,
        authors: book.authors,
        formats: { 'image/jpeg': book.formats['image/jpeg'] },
        bookshelves: book.bookshelves,
        addedAt: new Date(),
        highestPageReached: 1,
        totalPages: totalPages,
        progress: 0
      }
      await setDoc(userRef, { readingList: { [bookId]: bookData } }, { merge: true });
    }
    setIsInList(!isInList)
  }

  if (loading) return <div className="text-center py-10">Loading book details...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!book) return <div className="text-center py-10">Book not found.</div>;

  const author = book.authors[0];
  const progress = totalPages > 0 ? Math.round((highestPageReached / totalPages) * 100) : 0;

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/4">
          <img src={book.formats['image/jpeg']} alt={book.title} className="w-full rounded-lg shadow-lg" />
        </div>
        <div className="md:w-3/4">
          <h1 className="text-4xl font-bold">{book.title}</h1>
          {author && (
            <Link to={`/author/${encodeURIComponent(author.name)}`} className="text-xl text-blue-600 hover:underline">
              {author.name}
            </Link>
          )}
          <div className="mt-4">
            <h3 className="font-semibold">Subjects:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {book.subjects.slice(0, 5).map(subject => <span key={subject} className="bg-gray-200 px-2 py-1 rounded-full text-sm">{subject}</span>)}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Bookshelves:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {book.bookshelves.map(shelf => <span key={shelf} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">{shelf}</span>)}
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
             <button onClick={toggleReadingList} className={`px-6 py-2 rounded-full font-semibold ${isInList ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
              {isInList ? 'Remove from My List' : 'Add to My List'}
            </button>
            <button onClick={saveProgress} className="px-6 py-2 rounded-full bg-yellow-500 text-white">
              Save Progress
            </button>
          </div>
        </div>
      </div>
      
      <div className="my-8 p-6 bg-white rounded-lg shadow">
        <ProgressBar progress={progress} />
      </div>

      <BookReader
        pages={pages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={totalPages}
        isLoading={textLoading}
      />
    </div>
  )
};

export default BookDetail;