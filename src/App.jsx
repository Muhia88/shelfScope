// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { auth, db, googleProvider } from './firebase/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Page Imports
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import AuthorPage from './pages/AuthorPage';
import BookDetail from './pages/BookDetail';
import ReadingList from './pages/ReadingList';
import Discover from './pages/Discover';
import LoginPage from './pages/LoginPage';
import ChoosePath from './pages/ChoosePath';
// Listen Path Imports
import ListenHomePage from './pages/listen/ListenHomePage';
import DiscoverAudioBooks from './pages/listen/DiscoverAudioBooks';
import MyListens from './pages/listen/MyListens';
import AudioBookDetail from './pages/listen/AudioBookDetail';
import AudioBookSearchResults from './pages/listen/AudioBookSearchResults';


// Component Imports
import Navbar from './components/Navbar';
import ListenNavbar from './components/listen/ListenNavbar';

// Read Path Layout
const ReadLayout = ({ user, onSignOut }) => (
  <div className="flex flex-col min-h-screen bg-gray-100">
    <Navbar user={user} onSignOut={onSignOut} />
    <main className="container mx-auto px-4 py-8 flex-1">
      <Outlet />
    </main>
    <footer className="bg-white border-t py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>© {new Date().getFullYear()} ShelfScope.</p>
      </div>
    </footer>
  </div>
);

// Listen Path Layout
const ListenLayout = ({ user, onSignOut }) => (
  <div className="flex flex-col min-h-screen bg-gray-100">
    <ListenNavbar user={user} onSignOut={onSignOut} />
    <main className="container mx-auto px-4 py-8 flex-1">
      <Outlet />
    </main>
    <footer className="bg-white border-t py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>© {new Date().getFullYear()} ShelfScope.</p>
      </div>
    </footer>
  </div>
);


// handles the main routing logic and user authentication state.
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
 
  //Shows a loading spinner during the initial authentication check.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <MainApp user={user} setUser={setUser} />
    </Router>
  );
};

const MainApp = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  //Handles the Google sign-in process
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      //Check if the user document already exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      
      // If the user is new, create a new document for them
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
          readingList: {},
          listenList: {}
        });
      }
      setUser(user);
      navigate('/choose-path');
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };
 
  //Handles the sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
 
  //handles routing based on authentication status
  useEffect(() => {
    const publicRoutes = ['/login'];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    if (!user && !isPublicRoute) {
      navigate('/login');
    } else if (user && isPublicRoute) {
      navigate('/choose-path');
    }
  }, [user, location.pathname, navigate]);

  // If there is no user, only render the login route
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onSignIn={handleGoogleSignIn} />} />
      </Routes>
    )
  }

  // If a user is logged in, render all the application routes
  return (
      <Routes>
        <Route path="/choose-path" element={<ChoosePath onSignOut={handleSignOut} />} />
        
        {/* Read Path */}
        <Route element={<ReadLayout user={user} onSignOut={handleSignOut} />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/author/:authorName" element={<AuthorPage />} />
          <Route path="/book/:bookId" element={<BookDetail user={user} />} />
          <Route path="/my-list" element={<ReadingList user={user} />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/discover/:genre" element={<Discover />} />
        </Route>

        {/* Listen Path */}
        <Route element={<ListenLayout user={user} onSignOut={handleSignOut} />}>
            <Route path="/listen" element={<ListenHomePage />} />
            <Route path="/listen/search" element={<AudioBookSearchResults />} />
            <Route path="/discover-audiobooks" element={<DiscoverAudioBooks />} />
            <Route path="/discover-audiobooks/:genre" element={<DiscoverAudioBooks />} />
            <Route path="/my-listens" element={<MyListens user={user} />} />
            <Route path="/audiobook/:audioBookId" element={<AudioBookDetail user={user} />} />
        </Route>

      </Routes>
  );
};

export default App;