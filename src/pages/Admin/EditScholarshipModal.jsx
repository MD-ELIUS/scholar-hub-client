import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { IoClose } from "react-icons/io5";

const EditScholarshipModal = ({ scholarship, onUpdated, onClose }) => {
  const axiosSecure = useAxiosSecure();
  // Added errors to destructuring
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
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

  // ---------------------- PRE-FILL FORM ----------------------
  useEffect(() => {
    if (scholarship) {
      const fields = [
        "scholarshipName",
        "universityName",
        "country",
        "city",
        "worldRank",
        "subjectCategory",
        "scholarshipCategory",
        "degree",
        "tuitionFees",
        "applicationFees",
        "serviceCharge",
        "totalAmount",
        "deadline",
        "description",
      ];
      fields.forEach((field) => setValue(field, scholarship[field]));

      setCountryInput(scholarship.country);
      setSelectedCountry(scholarship.country);
    }
  }, [scholarship, setValue]);

  // ---------------------- SUBMIT ----------------------
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const updatedScholarship = {
        ...data,
        postDate: scholarship.postDate,
        userEmail: scholarship.userEmail,
      };

      if (data.image && data.image.length > 0) {
        const formData = new FormData();
        formData.append("image", data.image[0]);
        const imgRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
          { method: "POST", body: formData }
        );
        const img = await imgRes.json();
        updatedScholarship.image = img.data.url;
      } else {
        updatedScholarship.image = scholarship.image;
      }

      const res = await axiosSecure.patch(
        `/scholarships/${scholarship._id}`,
        updatedScholarship
      );

      if (res.data.modifiedCount > 0) {
        Swal.fire({
          title: "Updated!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        onUpdated();
        onClose();
      }
    } catch (err) {
      Swal.fire("Error!", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "input input-bordered w-full rounded-tr-2xl rounded-bl-2xl";
  const fileStyle = "file-input file-input-bordered w-full rounded-tr-2xl rounded-bl-2xl";
  const errorMsg = "text-red-500 text-xs mt-1 font-semibold"; // Common error style

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-bl-2xl rounded-tr-2xl border border-primary/30 shadow-xl p-6">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-primary hover:text-red-500"
        >
          <IoClose size={28} />
        </button>

        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          Edit Scholarship
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Scholarship Name */}
          <div>
            <label className="text-sm">Scholarship Name</label>
            <input
              type="text"
              {...register("scholarshipName", { required: "Name is required" })}
              className={inputStyle}
            />
            {errors.scholarshipName && <p className={errorMsg}>{errors.scholarshipName.message}</p>}
          </div>

          {/* University Name */}
          <div>
            <label className="text-sm">University Name</label>
            <input
              type="text"
              {...register("universityName", { required: "University is required" })}
              className={inputStyle}
            />
            {errors.universityName && <p className={errorMsg}>{errors.universityName.message}</p>}
          </div>

          {/* Image */}
          <div>
            <label className="text-sm">Image</label>
            <input type="file" {...register("image")} className={fileStyle} />
            {scholarship.image && (
              <img
                src={scholarship.image}
                alt="scholarship"
                className="mt-2 w-32 h-20 object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Country + City */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="text-sm">Country</label>
              <input
                type="text"
                {...register("country", { required: "Country is required" })}
                value={countryInput}
                onChange={(e) => {
                  setCountryInput(e.target.value);
                  setSelectedCountry("");
                }}
                className={inputStyle}
              />
              {errors.country && <p className={errorMsg}>{errors.country.message}</p>}
              {countryInput && !selectedCountry && (
                <div className="absolute w-full mt-1 max-h-40 overflow-y-auto bg-white border rounded-lg z-50 shadow-lg">
                  {filteredCountries.map((c, i) => (
                    <p
                      key={i}
                      onClick={() => handleCountrySelect(c)}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                    >
                      {c.country}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm">City</label>
              <input
                type="text"
                {...register("city", { required: "City is required" })}
                disabled={!selectedCountry}
                className={`${inputStyle} ${!selectedCountry ? "bg-gray-200 cursor-not-allowed" : ""
                  }`}
              />
              {errors.city && <p className={errorMsg}>{errors.city.message}</p>}
            </div>
          </div>

          {/* Degree, Subject, Scholarship Category */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm">Degree</label>
              <select {...register("degree", { required: "Required" })} className={inputStyle}>
                <option value="">Select Degree</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="PhD">PhD</option>
                <option value="Diploma">Diploma</option>
              </select>
              {errors.degree && <p className={errorMsg}>{errors.degree.message}</p>}
            </div>
            <div>
              <label className="text-sm">Subject Category</label>
              <select {...register("subjectCategory", { required: "Required" })} className={inputStyle}>
                <option value="">Select Subject Category</option>
                <option value="Engineering">Engineering</option>
                <option value="Medical">Medical</option>
                <option value="Business">Business</option>
                <option value="Arts">Arts</option>
                <option value="Science">Science</option>
              </select>
              {errors.subjectCategory && <p className={errorMsg}>{errors.subjectCategory.message}</p>}
            </div>
            <div>
              <label className="text-sm">Scholarship Category</label>
              <select {...register("scholarshipCategory", { required: "Required" })} className={inputStyle}>
                <option value="">Select Scholarship Category</option>
                <option value="Fully Funded">Fully Funded</option>
                <option value="Partially Funded">Partially Funded</option>
                <option value="Tuition Only">Tuition Only</option>
                <option value="Living Expenses Covered">
                  Living Expenses Covered
                </option>
              </select>
              {errors.scholarshipCategory && <p className={errorMsg}>{errors.scholarshipCategory.message}</p>}
            </div>
          </div>

          {/* Scholarship Description - Validation Added Here */}
          <div>
            <label className="text-sm">Scholarship Description</label>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: { value: 2000, message: "Minimum 2000 characters required" },
                maxLength: { value: 2500, message: "Maximum 2500 characters allowed" }
              })}
              rows={8}
              placeholder="Enter full scholarship details..."
              className="textarea w-full rounded-tr-2xl rounded-bl-2xl border"
            />
            {errors.description && <p className={errorMsg}>{errors.description.message}</p>}
          </div>

          {/* Fees + Deadline */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Tuition Fees (optional) </label>
              <input type="number" {...register("tuitionFees",)} className={inputStyle} />

            </div>
            <div>
              <label className="text-sm">Total Amount</label>
              <input type="number" {...register("totalAmount", { required: "Required" })} className={inputStyle} />
              {errors.totalAmount && <p className={errorMsg}>{errors.totalAmount.message}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Application Fees</label>
              <input type="number" {...register("applicationFees", { required: "Required" })} className={inputStyle} />
              {errors.applicationFees && <p className={errorMsg}>{errors.applicationFees.message}</p>}
            </div>
            <div>
              <label className="text-sm">Service Charge</label>
              <input type="number" {...register("serviceCharge", { required: "Required" })} className={inputStyle} />
              {errors.serviceCharge && <p className={errorMsg}>{errors.serviceCharge.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm">Deadline</label>
            <input type="date" {...register("deadline", { required: "Deadline is required" })} className={inputStyle} />
            {errors.deadline && <p className={errorMsg}>{errors.deadline.message}</p>}
          </div>

          {/* Post Date + User Email */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Post Date</label>
              <input type="text" value={scholarship.postDate} readOnly className={`${inputStyle} bg-gray-200`} />
            </div>
            <div>
              <label className="text-sm">User Email</label>
              <input type="email" value={scholarship.userEmail} readOnly className={`${inputStyle} bg-gray-200`} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-secondary w-full rounded-tr-2xl rounded-bl-2xl">
            {loading ? "Updating..." : "Update Scholarship"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditScholarshipModal;