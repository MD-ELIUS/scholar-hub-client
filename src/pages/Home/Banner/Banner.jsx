import React, { useState } from "react";
import Lottie from "lottie-react";
import bannerAnimation from "../../../assets/lottie/banner-animation.json";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router";

const Banner = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/all-scholarships?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/all-scholarships");
    }
  };

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

       <div className="lg:w-2/3 mx-auto lg:mx-0">
  <div className="flex w-full ">
    <input
      type="text"
      placeholder="Search scholarships..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="flex-1 border-r-0 border border-primary rounded-none rounded-bl-2xl px-4 py-2 text-sm focus:outline-none"
    />
    <button
      onClick={handleSearch}
      className="btn btn-secondary btn-outline  px-4 py-2  hover:text-white flex items-center gap-2  rounded-tr-2xl rounded-none  border border-secondary "
    >
      <FaSearch />
      Search
    </button>
  </div>
</div>

      </div>

      {/* Lottie Animation Section */}
      <div className="h-[350px] lg:h-[450px] lg:-mr-6">
        <Lottie animationData={bannerAnimation} loop className="w-full h-full" />
      </div>
    </section>
  );
};

export default Banner;
