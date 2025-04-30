import {
        createUserWithEmailAndPassword,
        getAuth,
        GoogleAuthProvider,
        onAuthStateChanged,
        sendPasswordResetEmail,
        signInWithEmailAndPassword,
        signInWithPopup,
        signOut,
        updateProfile,
      } from "firebase/auth";
      import { createContext, useEffect, useState } from "react";
      import { app } from "./../firebase/firebase.config";
      
      export const AuthContext = createContext(null);
      const auth = getAuth(app);
      
      const AuthProvider = ({ children }) => {
        const [user, setUser] = useState(null);
        const [role, setRole] = useState(null);
        const [loading, setLoading] = useState(true);
        const googleProvider = new GoogleAuthProvider();
      
        const createUser = (email, password) => {
          setLoading(true);
          return createUserWithEmailAndPassword(auth, email, password);
        };
      
        const signIn = (email, password) => {
          setLoading(true);
          return signInWithEmailAndPassword(auth, email, password);
        };
      
        const googleSignIn = () => {
          setLoading(true);
          return signInWithPopup(auth, googleProvider);
        };
      
        const logOut = () => {
          setLoading(true);
          setRole(null);
          return signOut(auth);
        };
      
        const updateUserProfile = (name, photo) => {
          return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo,
          });
        };
      
        const resetPassword = (email) => {
          setLoading(true);
          return sendPasswordResetEmail(auth, email);
        };
      
        useEffect(() => {
          const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
              // Set a default role since there's no backend to fetch roles from
              setRole("citizen");
            } else {
              setRole(null);
            }
            setLoading(false);
          });
      
          return () => unsubscribe();
        }, []);
      
        const authInfo = {
          user,
          role,
          loading,
          createUser,
          signIn,
          logOut,
          updateUserProfile,
          googleSignIn,
          resetPassword,
        };
      
        return (
          <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
        );
      };
      
      export default AuthProvider;