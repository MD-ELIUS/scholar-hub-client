import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import ScholarshipCard from "../../components/ScholarshipCard";


const AllScholarshipsPage = () => {
  const axiosSecure = useAxiosSecure();

  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterCountry, setFilterCountry] = useState("");

  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ["allScholarships", searchText, filterCategory, filterSubject, filterCountry],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchText,
        scholarshipCategory: filterCategory,
        subjectCategory: filterSubject,
        country: filterCountry,
      }).toString();
      const res = await axiosSecure.get(`/scholarships?${params}`);
      return res.data;
    },
  });

  return (
    <div className="w-11/12 mx-auto  py-10">
      <h2 className="text-2xl sm:text-3xl md:text-4xl text-primary font-bold mb-8 text-center">
        All Scholarships ({scholarships.length})
      </h2>

      {/* Search + Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4  gap-4 mb-8 justify-items-center">
        <input
          type="text"
          placeholder="Search by Scholarship, University, or Degree"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="input w-full  border-secondary/50 rounded-bl-2xl rounded-tr-2xl outline-none"
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="select w-full border-secondary/50 rounded-bl-2xl rounded-tr-2xl outline-none"
        >
          <option value="">All Scholarship Categories</option>
          <option value="Fully Funded">Fully Funded</option>
          <option value="Partially Funded">Partially Funded</option>
          <option value="Tuition Only">Tuition Only</option>
          <option value="Living Expenses Covered">Living Expenses Covered</option>
        </select>

        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="select w-full  border-secondary/50 rounded-bl-2xl rounded-tr-2xl outline-none"
        >
          <option value="">All Subject Categories</option>
          <option value="Engineering">Engineering</option>
          <option value="Medical">Medical</option>
          <option value="Business">Business</option>
          <option value="Arts">Arts</option>
          <option value="Science">Science</option>
        </select>

        <input
          type="text"
          placeholder="Filter by Country"
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          className="input w-full  border-secondary/50 rounded-bl-2xl rounded-tr-2xl outline-none"
        />
      </div>

      {/* Scholarship Grid */}
      {isLoading ? (
        <p className="text-primary text-center py-10">Loading scholarships...</p>
      ) : scholarships.length === 0 ? (
        <p className="text-primary text-center py-10 opacity-70">No scholarships found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {scholarships.map((sch) => (
            <ScholarshipCard key={sch._id} scholarship={sch} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllScholarshipsPage;
