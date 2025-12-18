import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/lottie/loading-animation.json"

const LoadingScreen = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-[#F4FAF9]">
      {/* Lottie spinner */}
      <div className="w-40 h-40">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>

      {/* Loading Text */}
      <h2 className="mt-6 text-2xl font-bold text-primary">
        Loading ScholarHub...
      </h2>
      <p className="mt-2 text-center text-secondary/70 max-w-sm">
        Please wait while we prepare your experience.
      </p>

      {/* Optional animated dots */}
      <div className="flex mt-4 space-x-2">
        <span className="w-3 h-3 bg-secondary rounded-full animate-bounce delay-75"></span>
        <span className="w-3 h-3 bg-secondary rounded-full animate-bounce delay-150"></span>
        <span className="w-3 h-3 bg-secondary rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
};

export default LoadingScreen;
