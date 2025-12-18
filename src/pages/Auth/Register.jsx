import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Link } from 'react-router';
import Lottie from "lottie-react";
import registerAnimation from "../../assets/lottie/register-animation.json";
import Swal from "sweetalert2"; 
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import SocialLogin from './SocialLogin';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"; // ✅ added

const Register = () => {

    const {register, handleSubmit, formState: {errors}} = useForm();
    const {registerUser, updateUserProfile} = useAuth();
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false); // ✅ added
    const [loading, setLoading] = useState(false); // ✅ added loading state
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const location = useLocation();

    const handleRegistration = (data) => {
        setLoading(true); // ✅ start loading
        const profileImg = data.photo[0];

        registerUser(data.email, data.password)
        .then(result => {
            console.log(result)
            const formData = new FormData();
            formData.append('image', profileImg);

            const image_APIURL = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_image_host_key}`;

            axios.post(image_APIURL, formData)
            .then(res => {

                const photoURL = res.data.data.url;

                const userInfo = {
                    email: data.email,
                    displayName: data.name,
                    photoURL: photoURL,
                };

                axiosSecure.post('/users', userInfo);

                const userProfile = {
                    displayName: data.name,
                    photoURL: photoURL
                };

                updateUserProfile(userProfile)
                .then(() => {
                    setLoading(false); // ✅ stop loading
                    navigate(`${location.state ? location.state : "/"}`);
                    Swal.fire({
                        title: "Account Created!",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                })
                .catch(err => {
                    setLoading(false); // ✅ stop loading
                    setError(err.message)
                });
            });
        })
        .catch(error => {
            setLoading(false); // ✅ stop loading
            setError(error);
            Swal.fire({
                title: "Registration Failed",
                text: error.message,
                icon: "error",
                confirmButtonText: "OK",
            });
        });
    };

    return (
        <div className="w-11/12 mx-auto py-10 flex items-center justify-center">
            <div className="grid lg:grid-cols-2 gap-0 lg:gap-10 items-start w-full">

                {/* LEFT SIDE — FORM */}
                <div className="p-6 bg-white shadow-lg border border-secondary rounded-tr-2xl rounded-bl-2xl flex-1">
                    <h2 className="text-3xl font-bold mb-6 text-center text-primary">
                        Create Your Account
                    </h2>

                    <form onSubmit={handleSubmit(handleRegistration)}>
                        <fieldset className="fieldset space-y-2">

                            {/* Name */}
                            <label className="label">Name</label>
                            <input
                                type="text"
                                {...register('name', { required: true })}
                                className="input w-full outline-none border-primary rounded-tr-2xl rounded-bl-2xl"
                                placeholder="Your Name"
                            />
                            {errors.name && <p className="text-red-500">Name is required</p>}

                            {/* Photo */}
                            <label className="label">Upload Photo</label>
                            <input
                                type="file"
                                {...register('photo', { required: true })}
                                className="file-input file-input-bordered w-full border-primary rounded-tr-2xl rounded-bl-2xl"
                            />
                            {errors.photo && <p className="text-red-500">Photo is required</p>}

                            {/* Email */}
                            <label className="label">Email</label>
                            <input
                                type="email"
                                {...register('email', { required: true })}
                                className="input w-full input-bordered border-primary rounded-tr-2xl rounded-bl-2xl"
                                placeholder="Email"
                            />
                            {errors.email && <p className="text-red-500">Email is required</p>}

                            {/* Password */}
                            <label className="label">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register('password', {
                                        required: true,
                                        minLength: 6,
                                        pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}<>+=._-]).{8,}$/
                                    })}
                                    className="input w-full input-bordered border-primary pr-12 rounded-tr-2xl rounded-bl-2xl"
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary text-xl cursor-pointer"
                                    title={showPassword ? "Hide Password" : "Show Password"}
                                >
                                    {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                </button>
                            </div>
                            {errors.password?.type === "required" && <p className="text-red-500">Password is required</p>}
                            {errors.password?.type === "minLength" && <p className="text-red-500">Password must be 6 characters or longer</p>}
                            {errors.password?.type === "pattern" && (
                                <p className="text-red-500">
                                    Must include uppercase, lowercase, number & special character
                                </p>
                            )}

                            {error && <p className="text-red-500">{error.message}</p>}

                            <button 
                                className="btn btn-secondary btn-outline mt-4 w-full font-semibold rounded-tr-2xl rounded-bl-2xl"
                                disabled={loading} // ✅ disable while loading
                            >
                                {loading ? "Registering..." : "Register"} {/* ✅ loading text */}
                            </button>
                        </fieldset>
                    </form>

                    <div className="mt-6">
                        <SocialLogin />
                    </div>

                    {/* ✅ Added login route like on Login page */}
                    <p className="text-center mt-5 text-sm">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            state={location.state}
                            className="text-secondary font-semibold underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>

                {/* RIGHT SIDE — LOTTIE */}
                <div className="lg:flex hidden justify-center items-center mt-10">
                    <Lottie animationData={registerAnimation} loop className="w-full max-w-lg" />
                </div>

                {/* MOBILE LOTTIE */}
                <div className="lg:hidden flex justify-center items-center mt-6">
                    <Lottie animationData={registerAnimation} loop className="w-3/4 max-w-sm" />
                </div>

            </div>
        </div>
    );
};

export default Register;
