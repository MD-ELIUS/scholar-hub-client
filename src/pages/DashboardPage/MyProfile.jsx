import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import Lottie from "lottie-react";

// import profileAnimation from "../../assets/profile-lottie.json"; 

import useAuth from "../../hooks/useAuth";
import EditProfileModal from "../../components/dashboard/EditProfileModal";
import useRole from "../../hooks/useRole";

const MyProfile = () => {
  const { user } = useAuth();
  const [openEdit, setOpenEdit] = useState(false);
  const { role } = useRole();
  return (
    <div className="w-full flex flex-col lg:flex-row items-center lg:items-start gap-6">

      {/* Optional Lottie Animation */}
      {/* <div className="w-full lg:w-1/2 flex justify-center">
        <div className="w-64 h-64 lg:w-80 lg:h-80">
          <Lottie animationData={profileAnimation} loop={true} />
        </div>
      </div> */}

      {/* Profile Info */}
      <div className="w-full lg:w-1/2">
        <div className="bg-white shadow-lg rounded-bl-2xl rounded-tr-2xl p-6 border border-secondary/50">

          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary shadow">
              <img
                src={user?.photoURL || "/avatar.png"}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-primary">{user?.displayName}</h1>
              <span className="px-3 py-1 rounded-bl-2xl rounded-tr-2xl text-sm bg-secondary/20 text-secondary font-medium">
                {role}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-b my-5 border-secondary/20"></div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-primary">{user?.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Account Created</p>
              <p className="font-medium">{user?.metadata?.creationTime}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Last Login</p>
              <p className="font-medium">{user?.metadata?.lastSignInTime}</p>
            </div>
          </div>


          {/* Edit Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setOpenEdit(true)}
              className="btn btn-secondary rounded-tr-2xl rounded-bl-2xl shadow flex items-center gap-2"
            >
              <FaEdit /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {openEdit && <EditProfileModal close={() => setOpenEdit(false)} user={user} />}
    </div>
  );
};

export default MyProfile;
