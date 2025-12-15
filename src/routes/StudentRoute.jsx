import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Forbidden from '../components/error/Forbidden';

const StudentRoute = ({children}) => {
    const { loading } = useAuth();
       const { role, roleLoading } = useRole()

    if (loading || roleLoading) {
        return <LoadingScreen/>
    }

    if (role !== 'student') {
        return <Forbidden></Forbidden>
    }

    return children;
};

export default StudentRoute;