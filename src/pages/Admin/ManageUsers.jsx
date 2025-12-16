import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FaUserShield } from 'react-icons/fa';
import { FiShieldOff } from 'react-icons/fi';
import { RiDeleteBin6Line } from "react-icons/ri";

import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import LoadingData from '../../components/Loading/LoadingData';

const ManageUsers = () => {

  const axiosSecure = useAxiosSecure();
  const { user: loggedUser } = useAuth();
  const { refetchRole } = useRole();

  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // ==== GET USERS ====
  const { refetch, data: users = [] , isLoading } = useQuery({
    queryKey: ['users', searchText, filterRole],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users?search=${searchText}&role=${filterRole}`
      );
      return res.data;
    }
  });

  // ==== CHANGE ROLE ====
  const handleChangeRole = (user, newRole) => {
    axiosSecure.patch(`/users/${user._id}/role`, { role: newRole })
      .then(res => {
        if (res.data.modifiedCount > 0) {

          // 🔁 refetch users list
          refetch();

          // 🔥 if logged-in user's role changed → refetch role
          if (user.email === loggedUser?.email) {
            refetchRole();
          }

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${user.displayName} is now ${newRole}`,
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
  };

  // ==== DELETE USER ====
  const handleDeleteUser = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete ${user.displayName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${user._id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              refetch();
              Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: `${user.displayName} removed.`,
              });
            }
          });
      }
    });
  };

  // ==== ROLE-BASED EMPTY MESSAGE ====
  const getEmptyMessage = () => {
    if (users.length > 0) return null;
    if (filterRole === "admin") return "No Admin found.";
    if (filterRole === "moderator") return "No Moderator found.";
    if (filterRole === "student") return "No Student found.";
    return "No users found.";
  };

  

  return (
    <div>
      <h2 className="text-3xl text-primary font-semibold mb-6">
        Manage Users ({users.length})
      </h2>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name/email"
          className="input w-full max-w-xs outline-none border-secondary/50 rounded-bl-2xl rounded-tr-2xl"
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="select outline-none border-secondary rounded-bl-2xl rounded-tr-2xl"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border border-secondary rounded-bl-2xl rounded-tr-2xl">
        <table className="table">
          <thead>
            <tr className='bg-primary text-white'>
              <th className="text-center">#</th>
              <th className="text-center">Image</th>
              <th className="text-center">Name</th>
              <th className="text-center">Email</th>
              <th className="text-center">Current Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {isLoading && (
              <tr>
                <td colSpan="8" className="text-center py-10 text-primary">
                  Loading...
                </td>
              </tr>
            )}

            {!isLoading && users.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-10 text-xl font-semibold text-primary opacity-70">
                  {getEmptyMessage()}
                </td>
              </tr>
            )}

            {users.map((user, index) => (
              <tr key={user._id}>
                <td className="text-center text-primary">{index + 1}</td>

                <td className="text-center">
                  <div className="avatar">
                    <div className="rounded-full border border-primary h-12 w-12 mx-auto">
                      <img src={user.photoURL} alt="profile" />
                    </div>
                  </div>
                </td>

                <td className="text-center text-primary font-semibold">
                  {user.displayName}
                </td>

                <td className="text-center text-primary opacity-70">
                  {user.email}
                </td>

                <td className="font-medium text-center text-primary capitalize">
                  {user.role}
                </td>

                <td className="text-center">
                  <div className="inline-flex gap-4 justify-center">

                    {user.role !== "admin" && (
                      <button
                        className="text-primary tooltip tooltip-primary"
                        data-tip="Make Admin"
                        onClick={() => handleChangeRole(user, "admin")}
                      >
                        <FaUserShield size={24} />
                      </button>
                    )}

                    {user.role !== "student" && (
                      <button
                        className="text-black tooltip"
                        data-tip="Make Student"
                        onClick={() => handleChangeRole(user, "student")}
                      >
                        <FiShieldOff size={24} />
                      </button>
                    )}

                    {user.role !== "moderator" && (
                      <button
                        className="text-secondary tooltip tooltip-secondary"
                        data-tip="Make Moderator"
                        onClick={() => handleChangeRole(user, "moderator")}
                      >
                        <FaUserShield size={24} />
                      </button>
                    )}

                    <button
                      className="text-red-500 tooltip tooltip-error"
                      data-tip="Delete User"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <RiDeleteBin6Line size={24} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
