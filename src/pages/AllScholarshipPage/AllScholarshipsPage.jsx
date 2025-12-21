import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import ScholarshipCard from "../../components/ScholarshipCard";
import { useLocation } from "react-router";
import useTitle from "../../hooks/useTitle";
import LoadingData from "../../components/Loading/LoadingData";

const AllScholarshipsPage = () => {
  useTitle("All Scholarships");
  const axiosSecure = useAxiosSecure();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";

  const [searchText, setSearchText] = useState(initialSearch);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  // ✅ ADD THIS
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  const { data = {}, isLoading } = useQuery({
    queryKey: [
      "allScholarships",
      searchText,
      filterCategory,
      filterSubject,
      sortBy,
      page,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchText,
        scholarshipCategory: filterCategory,
        subjectCategory: filterSubject,
        sort: sortBy,
        page,
        limit,
      }).toString();

      const res = await axiosSecure.get(`/scholarships?${params}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  const { scholarships = [], totalPages = 0, totalCount = 0 } = data;

  return (
    <div className="w-11/12 mx-auto pt-10">
      <h2 className="text-2xl sm:text-3xl md:text-4xl text-primary font-bold mb-8 text-center">
        All Scholarships ({totalCount})
      </h2>

      {/* SEARCH + FILTER + SORT */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 justify-items-center">
        <input
          type="text"
          placeholder="Search by Scholarship, University, Degree, or Country"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
          className="input w-full border-secondary/50 rounded-bl-2xl rounded-tr-2xl outline-none"
        />

        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setPage(1);
          }}
          className="select w-full border-secondary/50 rounded-bl-2xl rounded-tr-2xl outline-none"
        >
          <option value="">All Scholarship Categories</option>
          <option value="Fully Funded">Fully Funded</option>
          <option value="Partially Funded">Partially Funded</option>
          <option value="Tuition Only">Tuition Only</option>
          <option value="Living Expenses Covered">
            Living Expenses Covered
          </option>
        </select>

        <select
          value={filterSubject}
          onChange={(e) => {
            setFilterSubject(e.target.value);
            setPage(1);
          }}
          className="select w-full border-secondary/50 rounded-bl-2xl rounded-tr-2xl outline-none"
        >
          <option value="">All Subject Categories</option>
          <option value="Engineering">Engineering</option>
          <option value="Medical">Medical</option>
          <option value="Business">Business</option>
          <option value="Arts">Arts</option>
          <option value="Science">Science</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="select w-full border-secondary/50 rounded-bl-2xl rounded-tr-2xl outline-none"
        >
          <option value="">Sort By</option>
          <option value="applicationFeesAsc">
            Application Fees: Low → High
          </option>
          <option value="applicationFeesDesc">
            Application Fees: High → Low
          </option>
          <option value="postDateNew">Newest First</option>
          <option value="postDateOld">Oldest First</option>
        </select>
      </div>

      {/* GRID */}
      {isLoading ? (
       <LoadingData></LoadingData>
      ) : scholarships.length === 0 ? (
        <p className="text-center py-10 text-primary opacity-70">
          No scholarships found.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {scholarships.map((sch) => (
              <ScholarshipCard key={sch._id} scholarship={sch} />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center mt-10 gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="btn btn-outline btn-secondary rounded-bl-2xl rounded-tr-2xl"
            >
              Prev
            </button>

            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num}
                onClick={() => setPage(num + 1)}
                className={`btn ${page === num + 1
                    ? "btn-secondary rounded-bl-2xl rounded-tr-2xl"
                    : "btn-outline btn-secondary rounded-bl-2xl rounded-tr-2xl"
                  }`}
              >
                {num + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="btn btn-outline btn-secondary rounded-bl-2xl rounded-tr-2xl"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllScholarshipsPage;
