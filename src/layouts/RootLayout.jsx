import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Navbar from '../components/shared/Navbar/Navbar';
import Footer from '../components/shared/Footer/Footer';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/Loading/LoadingScreen';
import ScrollToTop from '../components/shared/ScrollToTop';

const RootLayout = () => {
    const { loading } = useAuth();
    const location = useLocation();
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

    const isDashboardRoute = location.pathname.startsWith('/dashboard');

    if (loading && !isDashboardRoute) {
        return <LoadingScreen />;
    }

    return (
        <div className="bg-[#F4FAF9] max-w-[1600px] mx-auto min-h-screen flex flex-col">
            <ScrollToTop />

            {/* Navbar */}
            <section
                className={`sticky top-0 z-50 bg-[#F4FAF9] transition-shadow duration-300 ${shadow ? "shadow-lg" : ""
                    }`}
            >
                <Navbar />
            </section>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />
        </div>

    );
};

export default RootLayout;
