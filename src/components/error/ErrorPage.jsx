import Lottie from "lottie-react";
import errorAnimation from "../../assets/lottie/error.json";
import { Link } from "react-router";
import logo from "../../assets/logo.png";
import useTitle from "../../hooks/useTitle";

const ErrorPage = () => {
  useTitle("Error");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 px-4 -mt-20">

      {/* Lottie Animation */}
      <div className="max-w-md w-full">
        <Lottie animationData={errorAnimation} loop={true} />
      </div>

      {/* Text */}
      <h1 className="text-3xl md:text-4xl font-bold text-primary -mt-14 xl:-mt-20 z-5 ">
        Page Not Found
      </h1>

      <p className=" text-secondary/70 text-center text-sm max-w-md z-5 mt-4">
        The page you are looking for doesn’t exist or has been removed.
      </p>

      {/* Logo & Website Name */}
      <div className="flex  items-center gap-2 mt-6 ">
        <img
          src={logo}
          alt="Website Logo"
          className=" h-12 object-contain"
        />
        <h2 className="text-4xl font-bold text-primary">
          Scholar<span className="text-secondary">Hub</span>
        </h2>
      </div>



      {/* Button */}
      <Link to="/">
        <button className="btn btn-secondary btn-outline rounded-bl-2xl rounded-tr-2xl mt-6 px-8">
          Go Home
        </button>
      </Link>
    </div>
  );
};

export default ErrorPage;
