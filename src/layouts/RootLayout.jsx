import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Navbar from '../components/shared/Navbar/Navbar';
import Footer from '../components/shared/Footer/Footer';
import useAuth from '../hooks/useAuth'; 
import LoadingScreen from '../components/Loading/LoadingScreen';

const RootLayout = () => {
    const { loading } = useAuth(); 
    const location = useLocation();   // ✅ added
    const [shadow, setShadow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setShadow(true);
            } else {
                setShadow(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isDashboardRoute = location.pathname.startsWith('/dashboard'); // ✅ added

    if (loading && !isDashboardRoute) {
        return <LoadingScreen />;
    }

    return (
        <div className='bg-[#F4FAF9] max-w-[1600px] mx-auto '>
            <div className=''>
                <section
                  className={`sticky top-0  z-50 bg-[#F4FAF9] transition-shadow duration-300 ${shadow ? 'shadow-lg' : ''}`}
                >
                  <Navbar />
                </section>
                <Outlet />
                <Footer></Footer>
            </div>
        </div>
    );
};

export default RootLayout;
