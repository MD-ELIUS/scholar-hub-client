
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import useAuth from './useAuth';

const axiosSecure = axios.create({
    baseURL: "http://localhost:3000"
})

const useAxiosSecure = () => {

    const {user,  logOut} = useAuth() ;
    const navigate = useNavigate() ;
   
    useEffect(() => {
        // intercept request
        const requestInterceptor =    axiosSecure.interceptors.request.use(config => {

              config.headers.authorization = `Bearer ${localStorage.getItem("token")}`  

                return config

            })

               // intercept response
                 const responseInterceptor = axiosSecure.interceptors.response.use(res => {
        return res ;
    }, 
       error => {
        console.log(error) ;
        const status = error.status ;
        if(status === 401 || status === 403) {
            console.log('log out the user for bad intention')
            logOut()
            .then(() => {
                //Navigate user to the log in page
                  navigate("/register")
            })
        }
    }

)
            

            return () => {
                 axiosSecure.interceptors.request.eject(requestInterceptor) ;
                 axiosSecure.interceptors.response.eject(responseInterceptor) ;
            }
    }, [user, logOut, navigate])


    return axiosSecure ;
};

export default useAxiosSecure;