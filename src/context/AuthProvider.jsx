import React, { useEffect, useState } from 'react';

import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase.init';
import { AuthContext } from './AuthContext';



const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {

        const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log(user) 

     // register User
    const registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

        //Google Sign In 

    const signInGoogle = () => {
        setLoading(true); 
        return signInWithPopup(auth, googleProvider)
    }


    //Email-Password Login
    const signInUser = (email, password) => {
        setLoading(true); 
        return signInWithEmailAndPassword(auth, email, password)
    }

        //Log Out

    const logOut = () => {
        setLoading(true);
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
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
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