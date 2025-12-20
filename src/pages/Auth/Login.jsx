import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/lottie/login-animation.json";
import useAuth from "../../hooks/useAuth";
import SocialLogin from "./SocialLogin";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import useTitle from "../../hooks/useTitle";
const Login = () => {
  useTitle("Login");
  const { register, formState: { errors }, handleSubmit } = useForm();
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [firebaseError, setFirebaseError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogin = async (data) => {
    setFirebaseError("");
    setLoading(true);
    try {
      const result = await signInUser(data.email, data.password);
      console.log("Login successful:", result);
      // Wait a bit for token to be set in localStorage
      // This ensures the token is available before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      setLoading(false);
      navigate(location.state || "/");
    } catch (error) {
      setLoading(false);
      setFirebaseError(error.message);
    }
  };
  return (
    <div className="w-11/12 mx-auto py-10 flex items-center justify-center">
      <div className="grid md:grid-cols-2 gap-0 md:gap-10 items-start  w-full max-w-6xl">
        {/* LEFT SIDE — FORM */}
        <div className="p-6 bg-white shadow-lg border border-secondary rounded-tr-2xl rounded-bl-2xl flex-1">
          <h2 className="text-3xl font-bold mb-6 text-center text-primary">
            Welcome Back
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
            <fieldset className="fieldset space-y-2">
              {/* Email */}
              <label className="label">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="input w-full input-bordered border-primary focus:border-primary rounded-tr-2xl rounded-bl-2xl"
                placeholder="Email"
              />
              {errors.email?.type === "required" && (
                <p className="text-red-500">Email is required</p>
              )}
              {/* Password */}
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: true, minLength: 6 })}
                  className="input w-full input-bordered border-primary focus:border-primary pr-12 rounded-tr-2xl rounded-bl-2xl"
                  placeholder="Password"
                />
                {/* Show/Hide Eye */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary cursor-pointer text-xl"
                >
                  <span className="tooltip" data-tip={showPassword ? "Hide Password" : "Show Password"}>
                    {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </span>
                </button>
              </div>
              {errors.password?.type === "minLength" && (
                <p className="text-red-500">Password must be 6 characters or longer</p>
              )}
              {firebaseError && (
                <p className="text-red-500">{firebaseError}</p>
              )}
              <div>
                <a className="link link-hover text-sm text-primary">
                  Forgot password?
                </a>
              </div>
              {/* Login Button */}
              <button
                type="submit"
                className="btn btn-secondary btn-outline mt-2 w-full text-black hover:text-white font-semibold rounded-tr-2xl rounded-bl-2xl"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </fieldset>
          </form>
          <div className="mt-6">
            <SocialLogin />
          </div>
          <p className="text-center mt-5 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              state={location.state}
              className="text-secondary font-semibold underline"
            >
              Register Now
            </Link>
          </p>
        </div>
        {/* RIGHT SIDE — LOTTIE */}
        <div className="hidden md:flex justify-center items-center mt-10 flex-1">
          <Lottie animationData={loginAnimation} loop className="w-full max-w-lg" />
        </div>
        {/* MOBILE LOTTIE */}
        <div className="md:hidden flex justify-center items-center mt-6">
          <Lottie animationData={loginAnimation} loop className="w-3/4 max-w-sm" />
        </div>
      </div>
    </div>
  );
};
export default Login;