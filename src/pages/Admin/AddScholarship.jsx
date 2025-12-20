import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const AddScholarship = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  // ---------------------- COUNTRY API ----------------------
  const { data: countryData = [] } = useQuery({
    queryKey: ["allCountries"],
    queryFn: async () => {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries");
      const data = await res.json();
      return data.data;
    },
  });

  const [countryInput, setCountryInput] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const filteredCountries = countryInput
    ? countryData.filter((c) =>
      c.country.toLowerCase().includes(countryInput.toLowerCase())
    )
    : [];

  const handleCountrySelect = (country) => {
    setSelectedCountry(country.country);
    setCountryInput(country.country);
    setValue("country", country.country);
  };

  // ---------------------- SUBMIT ----------------------
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const scholarship = {
        scholarshipName: data.scholarshipName,
        universityName: data.universityName,
        country: data.country,
        city: data.city,
        worldRank: data.worldRank,
        subjectCategory: data.subjectCategory,
        scholarshipCategory: data.scholarshipCategory,
        degree: data.degree,
        applicationFees: data.applicationFees,
        serviceCharge: data.serviceCharge,
        totalAmount: data.totalAmount,
        description: data.description,
        deadline: data.deadline,
        postDate: new Date(),
        userEmail: user.email,
      };

      const formData = new FormData();
      formData.append("image", data.image[0]);

      const imgRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
        { method: "POST", body: formData }
      );
      const img = await imgRes.json();
      scholarship.image = img.data.url;

      const res = await axiosSecure.post("/scholarships", scholarship);

      if (res.data.insertedId) {
        Swal.fire({
          title: "Scholarship Added!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        reset();
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "input outline-none w-full border-primary rounded-bl-2xl rounded-tr-2xl";
  const fileStyle =
    "file-input outline-none w-full border-primary rounded-bl-2xl rounded-tr-2xl";

  return (
    <div className="flex justify-center">
      <div className="p-6 bg-white shadow-lg border border-secondary/50 rounded-tr-2xl rounded-bl-2xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">
          Add New Scholarship
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="space-y-4">
            {/* Scholarship Name */}
            <div>
              <label className="label">Scholarship Name</label>
              <input
                type="text"
                {...register("scholarshipName", {
                  required: "Scholarship name is required",
                })}
                className={inputStyle}
              />
              {errors.scholarshipName && (
                <p className="text-red-500 text-sm">
                  {errors.scholarshipName.message}
                </p>
              )}
            </div>

            {/* University Name */}
            <div>
              <label className="label">University Name</label>
              <input
                type="text"
                {...register("universityName", {
                  required: "University name is required",
                })}
                className={inputStyle}
              />
              {errors.universityName && (
                <p className="text-red-500 text-sm">
                  {errors.universityName.message}
                </p>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="label">Image</label>
              <input
                type="file"
                {...register("image", { required: "Image is required" })}
                className={fileStyle}
              />
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image.message}</p>
              )}
            </div>

            {/* Country + City */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="label">Country</label>
                <input
                  type="text"
                  {...register("country", {
                    required: "Country is required",
                  })}
                  value={countryInput}
                  onChange={(e) => {
                    setCountryInput(e.target.value);
                    setSelectedCountry("");
                  }}
                  placeholder="Start typing country..."
                  className={inputStyle}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm">
                    {errors.country.message}
                  </p>
                )}

                {countryInput && !selectedCountry && (
                  <div className="border bg-white rounded-lg mt-1 max-h-40 overflow-y-auto absolute w-full z-50">
                    {filteredCountries.map((c, i) => (
                      <p
                        key={i}
                        onClick={() => handleCountrySelect(c)}
                        className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                      >
                        {c.country}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="label">City</label>
                <input
                  type="text"
                  {...register("city", { required: "City is required" })}
                  disabled={!selectedCountry}
                  className={`${inputStyle} ${!selectedCountry
                      ? "bg-gray-200 cursor-not-allowed"
                      : ""
                    }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm">
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>

            {/* World Rank + Degree */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">World Rank</label>
                <input
                  type="number"
                  {...register("worldRank", {
                    required: "World rank is required",
                    min: { value: 1, message: "Must be greater than 0" },
                  })}
                  className={inputStyle}
                />
                {errors.worldRank && (
                  <p className="text-red-500 text-sm">
                    {errors.worldRank.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Degree</label>
                <select
                  {...register("degree", { required: "Degree is required" })}
                  className="select w-full border-primary rounded-bl-2xl rounded-tr-2xl"
                >
                  <option value="">Select Degree</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="PhD">PhD</option>
                  <option value="Diploma">Diploma</option>
                </select>
                {errors.degree && (
                  <p className="text-red-500 text-sm">
                    {errors.degree.message}
                  </p>
                )}
              </div>
            </div>

            {/* Subject + Scholarship Category */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Subject Category</label>
                <select
                  {...register("subjectCategory", {
                    required: "Subject category is required",
                  })}
                  className="select w-full border-primary rounded-bl-2xl rounded-tr-2xl"
                >
                  <option value="">Select Subject Category</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Medical">Medical</option>
                  <option value="Business">Business</option>
                  <option value="Arts">Arts</option>
                  <option value="Science">Science</option>
                </select>
                {errors.subjectCategory && (
                  <p className="text-red-500 text-sm">
                    {errors.subjectCategory.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Scholarship Category</label>
                <select
                  {...register("scholarshipCategory", {
                    required: "Scholarship category is required",
                  })}
                  className="select w-full border-primary rounded-bl-2xl rounded-tr-2xl"
                >
                  <option value="">Select Scholarship Category</option>
                  <option value="Fully Funded">Fully Funded</option>
                  <option value="Partially Funded">Partially Funded</option>
                  <option value="Tuition Only">Tuition Only</option>
                  <option value="Living Expenses Covered">
                    Living Expenses Covered
                  </option>
                </select>
                {errors.scholarshipCategory && (
                  <p className="text-red-500 text-sm">
                    {errors.scholarshipCategory.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="label">Scholarship Description</label>
             <textarea
  {...register("description", {
    required: "Description is required",
    minLength: {
      value: 2000,
      message: "Minimum 2000 characters required",
    },
    maxLength: {
      value: 2500,
      message: "Maximum 2500 characters allowed",
    },
  })}
  rows={10}
  placeholder="Write a detailed scholarship description (minimum 2000 and maximum 2500 characters).

Include:
• Scholarship overview and purpose
• University background and global ranking
• Degree level and subject focus
• Funding details and financial coverage
• Eligibility criteria and application process
• Academic and career benefits for students

⚠️ Description must be within 2000–2500 characters. Submissions outside this range will show an error."
  className="textarea outline-none w-full border-primary rounded-bl-2xl rounded-tr-2xl"
/>

              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Tuition + Total */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Tuition Fees (optional)</label>
                <input
                  type="number"
                  {...register("tuitionFees")}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="label">Total Amount</label>
                <input
                  type="number"
                  {...register("totalAmount", {
                    required: "Total amount is required",
                  })}
                  className={inputStyle}
                />
                {errors.totalAmount && (
                  <p className="text-red-500 text-sm">
                    {errors.totalAmount.message}
                  </p>
                )}
              </div>
            </div>

            {/* Fees */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Application Fees</label>
                <input
                  type="number"
                  {...register("applicationFees", {
                    required: "Application fee is required",
                  })}
                  className={inputStyle}
                />
                {errors.applicationFees && (
                  <p className="text-red-500 text-sm">
                    {errors.applicationFees.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Service Charge</label>
                <input
                  type="number"
                  {...register("serviceCharge", {
                    required: "Service charge is required",
                  })}
                  className={inputStyle}
                />
                {errors.serviceCharge && (
                  <p className="text-red-500 text-sm">
                    {errors.serviceCharge.message}
                  </p>
                )}
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="label">Deadline</label>
              <input
                type="date"
                {...register("deadline", {
                  required: "Deadline is required",
                })}
                className={inputStyle}
              />
              {errors.deadline && (
                <p className="text-red-500 text-sm">
                  {errors.deadline.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="label">User Email</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className={`${inputStyle} bg-gray-200`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-secondary btn-outline rounded-bl-2xl rounded-tr-2xl text-black hover:text-white w-full mt-4"
            >
              {loading ? "Adding..." : "Add Scholarship"}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default AddScholarship;
