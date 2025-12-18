import React from "react";
import Lottie from "lottie-react";
import bannerAnimation from "../../../assets/lottie/banner-animation.json"; // adjust the path
import { FaSearch } from "react-icons/fa";

const Banner = () => {
  return (
    <section className="max-w-11/12 mx-auto text-primary flex flex-col lg:flex-row items-center justify-between gap-4 rounded-b-3xl mt-5 lg:mt-0 lg:max-h-[500px]">


    
      {/* Text Section */}
<div className="lg:w-1/2 space-y-6 text-center lg:text-left flex flex-col justify-center">
  <h1 className="text-[2rem] sm:text-[2.5rem] md:text-4xl lg:text-5xl font-bold leading-tight">
    Discover Scholarships <br /> That Fit Your Goals
  </h1>
  <p className="text-base sm:text-lg md:text-xl lg:text-xl text-primary/80">
    ScholarHub helps you find and apply for scholarships worldwide.
  </p>
 <button className="btn btn-secondary btn-outline rounded-bl-2xl rounded-tr-2xl px-6 py-3 font-medium text-black hover:text-white flex items-center gap-2  lg:w-1/2 mx-auto lg:mx-0">
  <FaSearch />
  Search Scholarships
</button>
</div>

          {/* Lottie Animation Section */}
      <div className=" h-[350px] lg:h-[450px] lg:-mr-6 ">
        <Lottie 
          animationData={bannerAnimation} 
          loop={true} 
          className="w-full h-full"
        />
      </div>
      

      

    </section>
  );
};

export default Banner;
