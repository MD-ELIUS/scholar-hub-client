import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

// import SocialLogin from './SocialLogin/SocialLogin'; 
import { useLocation, useNavigate } from 'react-router';

// import useAxiosSecure from '../../hooks/useAxiosSecure';
import Lottie from "lottie-react";
import registerAnimation from "../../assets/lottie/register-animation.json"; // your lottie file
import Swal from "sweetalert2";
import useAuth from '../../hooks/useAuth';
import axios from 'axios';

const Register = () => {

    const {register, handleSubmit, formState: {errors}} = useForm();
    const {registerUser, updateUserProfile} = useAuth();
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    // const axiosSecure = useAxiosSecure(); 
    const location = useLocation();

    const handleRegistration = (data) => {
        console.log("after register", data.photo[0]);
        const profileImg = data.photo[0];

        registerUser(data.email, data.password)
        .then(result => {
            console.log(result.user);

            //1. Store the image in FormData
            const formData = new FormData();
            formData.append('image', profileImg);

            //2. Upload to imgbb
            const image_APIURL = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_image_host_key}`;

            axios.post(image_APIURL, formData)
            .then(res => {
                console.log('after image upload', res);

                const photoURL = res.data.data.url;

                // Create user object
                // const userInfo = {
                //     email: data.email,
                //     displayName: data.name,
                //     photoURL: photoURL,
                // };

                // --- Optional MongoDB save (commented as per request) ---
                // axiosSecure.post('/users', userInfo)
                // .then(res => {
                //     if (res.data.insertedId) {
                //         console.log('new user created in DB', res.data);
                //     }
                // });

                //3. update Firebase profile
                const userProfile = {
                    displayName: data.name,
                    photoURL: photoURL
                };

                updateUserProfile(userProfile)
                .then(() => {
                    console.log('user profile updated done');

                    Swal.fire({
                        title: "Account Created!",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });

                    navigate(`${location.state ? location.state : "/"}`);
                })
                .catch(err => setError(err.message));

            });

        })
        .catch(error => {
            console.log(error);
            setError(error);

            Swal.fire({
                title: "Registration Failed",
                text: error.message,
                icon: "error",
            });
        });
    };


    return (
        <div className="w-11/12 mx-auto py-10  flex items-center justify-center">
            <div className="grid lg:grid-cols-2 gap-10 items-start w-full ">

                {/* LEFT SIDE — FORM */}
                <div className="p-6 bg-white shadow-lg border border-gray-300 rounded-tr-2xl rounded-bl-2xl flex-1">
                    <h2 className="text-3xl font-bold mb-6 text-center text-primary">Create Your Account</h2>

                    <form onSubmit={handleSubmit(handleRegistration)}>
                        <fieldset className="fieldset space-y-4">

                            {/* Name */}
                            <label className="label">Name</label>
                            <input
                                type="text"
                                {...register('name', { required: true })}
                                className="input w-full outline-none border-primary  rounded-tr-2xl rounded-bl-2xl"
                                placeholder="Your Name"
                            />
                            {errors.name?.type === 'required' && <p className='text-red-500'>Name is required</p>}

                            {/* Photo */}
                            <label className="label">Upload Photo</label>
                            <input
                                type="file"
                                {...register('photo', { required: true })}
                                className="file-input file-input-bordered w-full border-primary rounded-tr-2xl rounded-bl-2xl"
                            />
                            {errors.photo?.type === 'required' && <p className='text-red-500'>Photo is required</p>}

                            {/* Email */}
                            <label className="label">Email</label>
                            <input
                                type="email"
                                {...register('email', { required: true })}
                                className="input w-full input-bordered border-primary focus:border-primary rounded-tr-2xl rounded-bl-2xl"
                                placeholder="Email"
                            />
                            {errors.email?.type === 'required' && <p className='text-red-500'>Email is required</p>}

                            {/* Password */}
                            <label className="label">Password</label>
                            <input
                                type="password"
                                {...register('password', {
                                    required: true,
                                    minLength: 6,
                                    pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}<>+=._-]).{8,}$/
                                })}
                                className="input w-full input-bordered border-primary focus:border-primary rounded-tr-2xl rounded-bl-2xl"
                                placeholder="Password"
                            />
                            {errors.password?.type === "required" && <p className='text-red-500'>Password is required</p>}
                            {errors.password?.type === "minLength" && <p className='text-red-500'>Password must be 6 characters or longer</p>}
                            {errors.password?.type === "pattern" && (
                                <p className="text-red-500">
                                    Must include uppercase, lowercase, number & special character
                                </p>
                            )}

                            {error && <p className='text-red-500'>{error.message}</p>}

                            <button className="btn btn-secondary btn-outline mt-4 w-full text-black hover:text-white font-semibold rounded-tr-2xl rounded-bl-2xl">Register</button>
                        </fieldset>
                    </form>

                    {/* <div className="mt-6">
                        <SocialLogin />
                    </div> */}
                </div>

                {/* RIGHT SIDE — LOTTIE */}
                <div className="lg:flex hidden justify-center items-center mt-15">
                    <Lottie animationData={registerAnimation} loop={true} className="w-full max-w-lg" />
                </div>

                {/* MOBILE LOTTIE
                <div className="lg:hidden flex justify-center items-center mt-6">
                    <Lottie animationData={registerAnimation} loop={true} className="w-3/4 max-w-sm" />
                </div> */}

            </div>
        </div>
    );
};

export default Register;
