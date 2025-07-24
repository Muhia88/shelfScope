import React from 'react'
import { Link } from 'react-router-dom'

//displays individual books
const BookCard = ({ book }) => {
  const author = (book.authors && book.authors[0]) ? book.authors[0].name : 'Unknown Author'
  const coverUrl = book.formats && book.formats['image/jpeg']

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <Link to={`/book/${book.id}`}>
        <img 
          src={coverUrl || '/image-placeholder.jpg'} 
          alt={book.title} 
          className="w-full h-64 object-cover"
        />
      </Link>
      <div className="p-4">
        <h3 className="font-bold text-lg truncate" title={book.title}>{book.title}</h3>
        <p className="text-gray-600 text-sm">
          by <Link 
            to={`/author/${encodeURIComponent(author)}`} 
            className="hover:text-blue-600"
          >
            {author}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default BookCard