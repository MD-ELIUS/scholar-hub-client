import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Forbidden from '../components/error/Forbidden';
import LoadingScreen from '../components/Loading/LoadingScreen';

const ModeratorRoute = ({children}) => {

       const { loading } = useAuth();
       const { role, roleLoading } = useRole()

    if (loading || roleLoading) {
        return <LoadingScreen/>
    }

    if (role !== 'moderator') {
        return <Forbidden></Forbidden>
    }

    return children;
   
};

export default ModeratorRoute;