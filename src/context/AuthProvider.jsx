import React, { useEffect, useState } from 'react';

import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase.init';
import { AuthContext } from './AuthContext';
import axios from 'axios';



const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {

        const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log(user) 

     // register User
    const registerUser = (email, password) => {
        
        return createUserWithEmailAndPassword(auth, email, password)
    }

        //Google Sign In 

    const signInGoogle = () => {
        
        return signInWithPopup(auth, googleProvider)
    }


    //Email-Password Login
    const signInUser = (email, password) => {
       
        return signInWithEmailAndPassword(auth, email, password)
    }

        //Log Out

    const logOut = () => {
       
        return signOut(auth)
    }


    // Update User 
    
    const updateUserProfile = (profile) => {
        
        return updateProfile(auth.currentUser, profile)
    }

    // Add this function inside AuthProvider
const updateUserState = (newData) => {
  setUser(prev => ({ ...prev, ...newData }));
};


    
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

               if (currentUser) {
      const loggedUser = { email: currentUser.email };
      console.log('logged user', loggedUser)

      try {
        const res = await axios.post(
          "http://localhost:3000/getToken",
          loggedUser
        );

        console.log("after getting token", res.data);
        localStorage.setItem("token", res.data.token);
      } catch (error) {
        console.error("Token error:", error);
      }
    } else {
      localStorage.removeItem("token");
    }

            setLoading(false);
        });

        return () => unSubscribe(); 
    }, []);



   const authInfo = {
        registerUser,
        signInUser,
        signInGoogle,
        user, 
        loading,
        logOut,
       updateUserProfile,
       updateUserState
   }

    return (
       <AuthContext value={authInfo}>
            {children}
       </AuthContext>
    );
};

export default AuthProvider;