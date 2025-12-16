import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/lottie/loading-animation.json";

const LoadingDashboard = ({
  title = "Loading Dashboard...",
  subtitle = "Fetching data and preparing insights for you."
}) => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-white">
      
      {/* Lottie Spinner */}
      <div className="w-44 h-44">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>

      {/* Title */}
      <h2 className="mt-6 text-2xl font-bold text-primary">
        {title}
      </h2>

      {/* Subtitle */}
      <p className="mt-2 text-center text-secondary/70 max-w-md">
        {subtitle}
      </p>

      {/* Animated Dots */}
      <div className="flex mt-4 space-x-2">
        <span className="w-3 h-3 bg-secondary rounded-full animate-bounce delay-75"></span>
        <span className="w-3 h-3 bg-secondary rounded-full animate-bounce delay-150"></span>
        <span className="w-3 h-3 bg-secondary rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
};

export default LoadingDashboard;
