import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import useAuth from './useAuth';

const axiosSecure = axios.create({
    baseURL: "https://scholar-hub-server-phi.vercel.app"
})

const useAxiosSecure = () => {

    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Only set up interceptors if user exists
        if (!user) return;

        // intercept request
        const requestInterceptor = axiosSecure.interceptors.request.use(config => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.authorization = `Bearer ${token}`;
            }
            return config;
        });

        // intercept response
        const responseInterceptor = axiosSecure.interceptors.response.use(
            (res) => res,
            async (error) => {
                const status = error.response?.status;
                const token = localStorage.getItem("token");

                // Only logout if ALL three conditions are true:
                // 1. Status is 401/403 (unauthorized/forbidden)
                // 2. Token exists (meaning it was sent but rejected - expired or invalid)
                // 3. User is currently logged in
                if ((status === 401 || status === 403) && token && user) {
                    console.log("Token expired or invalid - logging out");
                    await logOut();
                    navigate("/login");
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        }
    }, [user, logOut, navigate])


    return axiosSecure;
};

export default useAxiosSecure;