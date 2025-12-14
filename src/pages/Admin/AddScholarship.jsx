import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const AddScholarship = () => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
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

  description: data.description, // ✅ ADDED

  deadline: data.deadline,
  postDate: new Date(),
  userEmail: user.email,
};


      // Upload image
      const formData = new FormData();
      formData.append("image", data.image[0]);

      const imgRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
        { method: "POST", body: formData }
      );

      const img = await imgRes.json();
      scholarship.image = img.data.url;

      // Save to DB
      const res = await axiosSecure.post("/scholarships", scholarship);

      if (res.data.insertedId) {
        Swal.fire({
          title: "Scholarship Added!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        reset()
      }

    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
     
    }
  };

  // Shared style for all inputs
  const inputStyle =
    "input outline-none w-full border-primary rounded-bl-2xl rounded-tr-2xl";

  const fileStyle =
    "file-input outline-none w-full border-primary rounded-bl-2xl rounded-tr-2xl";

  return (
    <div className="w-11/12 mx-auto py-10 flex justify-center">
      <div className="p-6 bg-white shadow-lg border border-secondary/50 rounded-tr-2xl rounded-bl-2xl w-full max-w-4xl">

        <h2 className="text-3xl font-bold mb-6 text-center text-primary">
          Add New Scholarship
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="space-y-4">

            {/* Scholarship Name */}
            <div>
              <label className="label">Scholarship Name</label>
              <input type="text" {...register("scholarshipName", { required: true })} className={inputStyle} />
            </div>

            {/* University Name */}
            <div>
              <label className="label">University Name</label>
              <input type="text" {...register("universityName", { required: true })} className={inputStyle} />
            </div>

            {/* Image */}
            <div>
              <label className="label">Image</label>
              <input type="file" {...register("image", { required: true })} className={fileStyle} />
            </div>

                 {/* Country + City */}
            <div className="grid md:grid-cols-2 gap-4">

              {/* Country */}
              <div className="relative">
                <label className="label">Country</label>
                <input
                  type="text"
                  {...register("country", { required: true })}
                  placeholder="Start typing country..."
                  value={countryInput}
                  onChange={(e) => {
                    setCountryInput(e.target.value);
                    setSelectedCountry("");
                  }}
                  className={inputStyle}
                />

                {/* Suggestions */}
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

              {/* City - Disabled until country selected */}
              <div>
                <label className="label">City (manual)</label>
                <input
                  type="text"
                  {...register("city", { required: true })}
                  placeholder={selectedCountry ? "Type city" : "Select country first"}
                  disabled={!selectedCountry}
                  className={`${inputStyle} ${!selectedCountry ? "bg-gray-200 cursor-not-allowed" : ""}`}
                />
              </div>

            </div>


            {/* World Rank + Degree */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">World Rank</label>
                <input type="number" {...register("worldRank", { required: true })} className={inputStyle} />
              </div>

             {/* Degree */}
<div>
  <label className="label">Degree</label>
  <select
    {...register("degree", { required: true })}
    className="select w-full border-primary rounded-bl-2xl rounded-tr-2xl"
  >
    <option value="">Select Degree</option>
    <option value="Bachelor">Bachelor</option>
    <option value="Master">Postgraduate</option>
    <option value="PhD">PhD</option>
    <option value="Diploma">Diploma</option>
    {/* add more degrees as needed */}
  </select>
</div>
            </div>

            {/* Subject + Scholarship Category */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Subject Category */}
<div>
  <label className="label">Subject Category</label>
  <select
    {...register("subjectCategory", { required: true })}
    className="select w-full border-primary rounded-bl-2xl rounded-tr-2xl"
  >
    <option value="">Select Subject Category</option>
    <option value="Engineering">Engineering</option>
    <option value="Medical">Medical</option>
    <option value="Business">Business</option>
    <option value="Arts">Arts</option>
    <option value="Science">Science</option>
    {/* add more subjects as needed */}
  </select>
</div>



{/* Scholarship Category */}
<div>
  <label className="label">Scholarship Category</label>
  <select
    {...register("scholarshipCategory", { required: true })}
    className="select w-full border-primary rounded-bl-2xl rounded-tr-2xl"
  >
    <option value="">Select Scholarship Category</option>
    <option value="Merit-based">Fully Funded</option>
    <option value="Need-based">Partially Funded</option>
    <option value="Sports">Tuition Only</option>
    <option value="Research">Living Expenses Covered</option>
    {/* add more categories as needed */}
  </select>
</div>
            </div>

            
{/* Scholarship Description */}
<div>
  <label className="label">
    Scholarship Description
  </label>
  <textarea
    {...register("description", { required: true })}
    rows={8}
    placeholder="Enter full scholarship details (eligibility, benefits, application process, documents, etc.)"
    className="textarea outline-none w-full border-primary rounded-bl-2xl rounded-tr-2xl"
  />
  {errors.description && (
    <p className="text-red-500 text-sm mt-1">Description is required</p>
  )}
</div>

            {/* Tuition Fees + Total Amount */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Tuition Fees (optional)</label>
                <input type="number" {...register("tuitionFees")} className={inputStyle} />
              </div>

              <div>
                <label className="label">Total Amount</label>
                <input type="number" {...register("totalAmount", { required: true })} className={inputStyle} />
              </div>
            </div>

            {/* Application Fees + Service Charge */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Application Fees</label>
                <input type="number" {...register("applicationFees", { required: true })} className={inputStyle} />
              </div>

              <div>
                <label className="label">Service Charge</label>
                <input type="number" {...register("serviceCharge", { required: true })} className={inputStyle} />
              </div>
            </div>

       
            {/* Deadline */}
            <div>
              <label className="label">Deadline</label>
              <input type="date" {...register("deadline", { required: true })} className={inputStyle} />
            </div>

            {/* User Email */}
            <div>
              <label className="label">User Email</label>
              <input type="email" value={user.email} readOnly className={`${inputStyle} bg-gray-200`} />
            </div>

            <button type="submit" disabled={loading} className="btn btn-secondary w-full mt-4">
              {loading ? "Adding..." : "Add Scholarship"}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default AddScholarship;
