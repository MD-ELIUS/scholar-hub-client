import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/lottie/loading-animation.json";

const LoadingData = ({ height = 100 }) => {
  return (
    <div className="w-full flex justify-center items-center flex-col ">
      <div style={{ height }}>
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          className="h-full"
        />
      </div>

      {/* Subtitle */}
      <p className="-mt-6 text-center text-secondary/70 max-w-md">
        Loading Data....
      </p>

    </div>
  );
};

export default LoadingData;
