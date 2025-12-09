import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/lottie/login-animation.json"; 
import useAuth from "../../hooks/useAuth";
import SocialLogin from "./SocialLogin";

const Login = () => {
  const { register, formState: { errors }, handleSubmit } = useForm();
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [firebaseError, setFirebaseError] = useState("");   // ⭐ ADDED

  const handleLogin = (data) => {
    console.log("form data", data);

    setFirebaseError(""); // clear previous error

    signInUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        navigate(`${location.state ? location.state : "/"}`);
      })
      .catch((error) => {
        console.log(error);
        setFirebaseError(error.message);   // ⭐ ADDED
      });
  };

  return (
    <div className="w-11/12 mx-auto py-10  min-h-screen flex items-center justify-center">
      <div className="grid lg:grid-cols-2 gap-0 lg:gap-10 items-start w-full max-w-6xl">

        {/* LEFT SIDE — FORM */}
        <div className="p-6 bg-white shadow-lg border border-secondary rounded-tr-2xl rounded-bl-2xl flex-1">
          <h2 className="text-3xl font-bold mb-6 text-center text-primary">
            Welcome Back
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
            <fieldset className="fieldset space-y-4">

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
              <input
                type="password"
                {...register("password", { required: true, minLength: 6 })}
                className="input w-full input-bordered border-primary focus:border-primary rounded-tr-2xl rounded-bl-2xl"
                placeholder="Password"
              />
              {errors.password?.type === "minLength" && (
                <p className="text-red-500">Password must be 6 characters or longer</p>
              )}

              {/* ⭐ Firebase Login Error (ADDED) */}
              {firebaseError && (
                <p className="text-red-500">{firebaseError}</p>
              )}

              <div>
                <a className="link link-hover text-sm text-primary">Forgot password?</a>
              </div>

              <button className="btn btn-secondary btn-outline mt-2 w-full text-black hover:text-white font-semibold rounded-tr-2xl rounded-bl-2xl">
                Login
              </button>
            </fieldset>
          </form>

          <div className="mt-6">
            <SocialLogin />
          </div>

          <p className="text-center mt-5 text-sm">
            Don’t have an account?{" "}
            <Link
              to="/register"
              state={location.state}
              className="text-secondary font-semibold underline"
            >
              Register Now
            </Link>
          </p>

        </div>

        {/* RIGHT SIDE — LOTTIE (Large screen) */}
        <div className="hidden lg:flex justify-center items-center mt-10 flex-1">
          <Lottie animationData={loginAnimation} loop={true} className="w-full max-w-lg" />
        </div>

        {/* Mobile Lottie */}
        <div className="lg:hidden flex justify-center items-center mt-6">
          <Lottie animationData={loginAnimation} loop={true} className="w-3/4 max-w-sm" />
        </div>
      </div>
    </div>
  );
};

export default Login;
