import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const SocialLogin = () => {
  const { signInGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(false); // ⭐ added loading state

  const handleGoogleSignIn = () => {
    setLoading(true); // start loading
    signInGoogle()
      .then((result) => {
        console.log("Google login user:", result.user);

        const userInfo = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };

        axiosSecure.post("/users", userInfo).then((res) => {
          console.log("User saved in DB:", res.data);
          setLoading(false); // stop loading
          navigate(location.state || "/");
        }).catch(() => setLoading(false)); // stop loading if DB fails

        // In case DB saving is skipped
        if (!axiosSecure) setLoading(false); 
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // stop loading if error
      });
  };

  return (
    <div className="w-full mt-4">
      <div className="divider">OR</div>

      {/* GOOGLE LOGIN BUTTON */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading} // disable while loading
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
        <span>{loading ? "Signing in.." : "Continue with Google"}</span>
      </button>
    </div>
  );
};

export default SocialLogin;
