import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditScholarshipModal from "./EditScholarshipModal";
import { IoClose } from "react-icons/io5";

const ManageScholarships = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 12; // items per page

  const { data = {}, isLoading } = useQuery({
    queryKey: ["scholarships", searchText, filterCategory, filterSubject, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchText,
        scholarshipCategory: filterCategory,
        subjectCategory: filterSubject,
        page: currentPage,
        limit
      }).toString();

      const res = await axiosSecure.get(`/scholarships?${params}`);
      return res.data;
    },
  });

  const { scholarships = [], totalCount = 0, totalPages = 1 } = data;

  const handleDelete = async (id, scholarshipName) => {
    const confirm = await Swal.fire({
      title: `Delete ${scholarshipName}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/scholarships/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire("Deleted!", "Scholarship has been deleted.", "success");
          queryClient.invalidateQueries(["scholarships"]);
        }
      } catch (err) {
        Swal.fire("Error!", err.message, "error");
      }
    }
  };

  const handleEditClick = (scholarship) => {
    setEditingScholarship(scholarship);
    setIsModalOpen(true);
  };

  const handleUpdated = () => {
    queryClient.invalidateQueries(["scholarships"]);
    setIsModalOpen(false);
    setEditingScholarship(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full p-6 bg-white shadow-lg border border-secondary/50 rounded-tr-2xl rounded-bl-2xl">
      <h2 className="text-xl md:text-2xl lg:text-3xl text-primary font-semibold mb-6">
        All Scholarships ({totalCount})
      </h2>

      {/* SEARCH + FILTER */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Scholarship, University, Degree or country"
          className="input w-full max-w-xs outline-none border-secondary/50 rounded-bl-2xl rounded-tr-2xl"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
        />

        <select
          className="select w-full max-w-xs outline-none border-secondary/50 rounded-bl-2xl rounded-tr-2xl"
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Scholarship Categories</option>
          <option value="Fully Funded">Fully Funded</option>
          <option value="Partially Funded">Partially Funded</option>
          <option value="Tuition Only">Tuition Only</option>
          <option value="Living Expenses Covered">Living Expenses Covered</option>
        </select>

        <select
          className="select w-full max-w-xs outline-none border-secondary/50 rounded-bl-2xl rounded-tr-2xl"
          value={filterSubject}
          onChange={(e) => {
            setFilterSubject(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Subject Categories</option>
          <option value="Engineering">Engineering</option>
          <option value="Medical">Medical</option>
          <option value="Business">Business</option>
          <option value="Arts">Arts</option>
          <option value="Science">Science</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border border-secondary rounded-bl-2xl rounded-tr-2xl">
        <table className="table w-full text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Scholarship</th>
              <th className="text-center">University</th>
              <th className="text-center">Degree</th>
              <th className="text-center">Subject Category</th>
              <th className="text-center">Scholarship Category</th>
              <th className="text-center">Country</th>
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

            {!isLoading && scholarships.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-10 text-primary opacity-70">
                  No scholarships found.
                </td>
              </tr>
            )}

            {scholarships.map((sch, index) => (
              <tr key={sch._id} className="hover:bg-gray-50">
                <td className="text-center text-primary">{(currentPage - 1) * limit + index + 1}</td>
                <td className="text-center text-primary font-semibold">{sch.scholarshipName}</td>
                <td className="text-center text-primary">{sch.universityName}</td>
                <td className="text-center text-primary">{sch.degree}</td>
                <td className="text-center text-primary">{sch.subjectCategory}</td>
                <td className="text-center text-primary">{sch.scholarshipCategory}</td>
                <td className="text-center text-primary">{sch.country}</td>
                <td className="text-center">
                  <div className="inline-flex gap-4 items-center justify-center">
                    <button
                      className="text-primary tooltip cursor-pointer"
                      data-tip="Edit Scholarship"
                      onClick={() => handleEditClick(sch)}
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      className="text-red-500 tooltip cursor-pointer"
                      data-tip="Delete Scholarship"
                      onClick={() => handleDelete(sch._id, sch.scholarshipName)}
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-secondary btn-outline rounded-tr-2xl rounded-bl-2xl  btn-sm"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`btn btn-secondary btn-sm rounded-tr-2xl rounded-bl-2xl ${currentPage === i + 1 ? "  " : "btn-outline"}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-secondary btn-outline rounded-tr-2xl rounded-bl-2xl  btn-sm"
          >
            Next
          </button>
        </div>
      )}

      {/* EDIT MODAL */}
      {isModalOpen && editingScholarship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-bl-2xl rounded-tr-2xl border border-primary/30 shadow-xl p-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-primary hover:text-red-500"
            >
              <IoClose size={28} />
            </button>

            <EditScholarshipModal
              scholarship={editingScholarship}
              onUpdated={handleUpdated}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageScholarships;
