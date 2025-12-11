import React  from 'react';

import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/Loading/LoadingScreen';



const PrivateRoute = ({children}) => {
    const { loading, user } = useAuth()
    const location = useLocation();
 

    if (loading) {
        return <LoadingScreen/>
    }


    if (user) {
        return children
    }

    return <Navigate state={location.pathname} to='/login' ></Navigate>;
};

export default PrivateRoute;