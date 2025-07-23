import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import BookCard from '../components/BookCard'

// SearchResults component fetches and displays search results based on the query parameters
// It supports both book author and topic searches by checking the 'type' query parameter
const SearchResults = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const searchQuery = queryParams.get('q') || ''
  const searchType = queryParams.get('type') || 'search' 
  
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true)
        let url = `https://gutendex.com/books?${searchType}=${encodeURIComponent(searchQuery)}`
        
        const response = await fetch(url)
        const data = await response.json()
        
        setBooks(data.results)
      } catch (err) {
        setError('Failed to fetch search results')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    if (searchQuery) {
      fetchSearchResults()
    }
  }, [searchQuery, searchType])

  if (loading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Search Results for: <span className="text-blue-600">"{searchQuery}"</span>
      </h1>
      
      {books.length === 0 ? (
        <p>No books found for your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchResults