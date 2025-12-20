import React, { useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useForm } from "react-hook-form";

const EditProfileModal = ({ close, user }) => {
  const { updateUserProfile, updateUserState } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: user?.displayName || "" },
  });

  const [photo, setPhoto] = useState(null);

  const handleUpdate = async (data) => {
    setLoading(true);

    try {
      let photoURL = user.photoURL;

      // Upload new profile picture if exists
      if (photo) {
        const formData = new FormData();
        formData.append("image", photo);

        const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
        const uploadRes = await axios.post(url, formData);
        photoURL = uploadRes.data.data.url;
      }

      // 1️⃣ Update Firebase
      await updateUserProfile({ displayName: data.name, photoURL });

      // 2️⃣ Update MongoDB
      await axiosSecure.patch(`/users/update/${user.email}`, {
        displayName: data.name,
        photoURL,
      });

      updateUserState({ displayName: data.name, photoURL });

      Swal.fire({
        title: "Profile Updated!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          title: "swal-title",
          popup: "swal-popup-success",
        },
      });

      close();
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-3">
      <div className="bg-white rounded-bl-2xl rounded-tr-2xl border border-primary/30 shadow-xl p-6 w-full max-w-lg relative">
        <button onClick={close} className="absolute top-3 right-3 text-primary">
          <IoClose size={28} />
        </button>

        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm">Name</label>
            <input
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "Name must be at least 3 characters" },
                maxLength: { value: 50, message: "Name cannot exceed 50 characters" },
              })}
              className="input input-bordered w-full border-primary rounded-tr-2xl rounded-bl-2xl"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Photo */}
          <div>
            <label className="text-sm">Upload New Photo</label>
            <input
              type="file"
              {...register("photo")}
              className="file-input file-input-bordered w-full border-primary rounded-tr-2xl rounded-bl-2xl"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-secondary w-full rounded-tr-2xl rounded-bl-2xl"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
