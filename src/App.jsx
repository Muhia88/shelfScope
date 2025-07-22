import React, { useState, useEffect } from 'react'
import { auth, db, googleProvider } from './firebase/firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
import { doc, setDoc, getDoc} from 'firebase/firestore'

// Main App component
function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Handle user authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(userRef)
      
      if (!docSnap.exists()) {
        // Create new user document
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
          readingList: {}
        })
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
    }
  }

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }
}
