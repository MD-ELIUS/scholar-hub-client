import Lottie from "lottie-react";

import { Link } from "react-router";

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">


      <h1 className="text-2xl md:text-3xl font-bold text-red-500 mt-4">
        You Are Forbidden to Access This Page
      </h1>

      <p className="text-base md:text-lg text-gray-600 mt-2 max-w-md">
        Please contact the administrator if you believe this is an error.
      </p>

      <div className="my-5 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="btn btn-primary rounded-bl-2xl rounded-tr-2xl btn-outline hover:text-white text-black px-6"
        >
          Go to Home
        </Link>
        <Link
          className="btn btn-secondary rounded-bl-2xl rounded-tr-2xl btn-outline hover:text-white text-black px-6"
          to="/dashboard"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;