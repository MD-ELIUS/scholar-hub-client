import React from 'react';
import Banner from './Banner/Banner';
import TopScholarships from './Banner/TopScholarships/TopScholarships';
import Testimonials from './Testimonials';
import Faq from './Faq';

const Home = () => {
    return (
        <div className=' bg-[#F4FAF9] overflow-hidden'>
            <Banner></Banner>
            <TopScholarships></TopScholarships>
            <Testimonials></Testimonials>
            <Faq></Faq>
        </div>
    );
};

export default Home;