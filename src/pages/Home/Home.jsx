import React from 'react';
import Banner from './Banner/Banner';
import TopScholarships from './Banner/TopScholarships/TopScholarships';

const Home = () => {
    return (
        <div className=' bg-[#F4FAF9]'>
            <Banner></Banner>
            <TopScholarships></TopScholarships>
        </div>
    );
};

export default Home;