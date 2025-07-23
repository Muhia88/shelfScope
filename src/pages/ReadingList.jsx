import React, { useState, useEffect } from 'react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import BookCard from '../components/BookCard'
import { Link } from 'react-router-dom'

const ReadingList = ({ user }) => {
  const [readingList, setReadingList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch user's reading list from Firestore
  useEffect(() => {
    const fetchReadingList = async () => {
      if (!user) {
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const list = userDoc.data().readingList || {}
          const books = Object.entries(list)
            .filter(([id, bookData]) => bookData && bookData.title)
            .map(([id, bookData]) => ({ ...bookData, id }))
            .sort((a, b) => (b.addedAt?.seconds || 0) - (a.addedAt?.seconds || 0))
          setReadingList(books)
        }
      } catch (err) {
        setError('Failed to fetch reading list')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchReadingList()
  }, [user])

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In to View Your Reading List</h2>
          <p className="text-gray-600 mb-6">
            Save books to your personal reading list and track your progress across devices.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Your Reading List
          <span className="ml-2 text-base text-gray-500">
            ({readingList.length} {readingList.length === 1 ? "book" : "books"})
          </span>
        </h1>
      </div>
      
      {readingList.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">You haven’t saved any books yet.</h3>
          <p className="text-gray-600 mb-4">
            Once you find a book you love, click "Save" to add it to your reading list.
          </p>
          <Link 
            to="/discover" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition duration-200"
          >
            Discover Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-500 ease-in-out opacity-100">
          {readingList.map((book) => (
            <BookCard 
              key={book.id} 
              book={book}
              showProgress={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ReadingList
