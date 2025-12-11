import React from "react";
import { FcGoogle } from "react-icons/fc";

import { useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

// import useAxiosSecure from "../../../hooks/useAxiosSecure"; // DB save disabled as requested

const SocialLogin = () => {
  // const axiosSecure = useAxiosSecure(); // commented as per your instruction
  const { signInGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure() ;

  const handleGoogleSignIn = () => {
    signInGoogle()
      .then((result) => {
        console.log("Google login user:", result.user);

        // --- Save user to DB (COMMENTED as requested) ---
        
        const userInfo = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };

        axiosSecure.post("/users", userInfo).then((res) => {
          console.log("User saved in DB:", res.data);
          navigate(location.state || "/");
        });
        

        navigate(location.state || "/");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="w-full mt-4">
      <div className="divider">OR</div>

      {/* GOOGLE LOGIN BUTTON */}
      <button
        onClick={handleGoogleSignIn}
        className="
          w-full 
          flex items-center justify-center gap-3
         btn btn-primary btn-outline text-black hover:text-white
          transition-all duration-300
          font-semibold py-2
          rounded-tr-2xl rounded-bl-2xl
        "
      >
        <FcGoogle size={26} />
        <span>Continue with Google</span>
      </button>
    </div>
  );
};

export default SocialLogin;
