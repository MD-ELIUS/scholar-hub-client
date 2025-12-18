import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Forbidden from '../components/error/Forbidden';
import LoadingScreen from '../components/Loading/LoadingScreen';

const StudentRoute = ({children}) => {
    const { loading } = useAuth();
       const { role, roleLoading } = useRole()

    if (loading || roleLoading) {
        return <LoadingScreen></LoadingScreen>
    }

    if (role !== 'student') {
        return <Forbidden></Forbidden>
    }

    return children;
};

export default StudentRoute;