import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/shared/Navbar/Navbar';
import Footer from '../components/shared/Footer/Footer';

const RootLayout = () => {
    return (
        <div className='bg-[#F4FAF9]'>
            <Navbar></Navbar>
           <Outlet></Outlet>
           {/* <Footer></Footer> */}
        </div>
    );
};

export default RootLayout;