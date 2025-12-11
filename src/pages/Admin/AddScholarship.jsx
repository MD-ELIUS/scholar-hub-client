import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';


const AddScholarship = () => {
  const { user } = useAuth(); // get logged in user
  const { register, handleSubmit, formState: { errors } } = useForm();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Prepare final scholarship object
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
        deadline: data.deadline,
        postDate: new Date().toISOString().split('T')[0], // today
        userEmail: user.email,
      };

      // Image upload to imgbb
      const formData = new FormData();
      formData.append('image', data.image[0]);
      const image_APIURL = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_image_host_key}`;
      const imageRes = await fetch(image_APIURL, { method: 'POST', body: formData });
      const imageResult = await imageRes.json();
      scholarship.image = imageResult.data.url;

      // Send to backend
      const res = await axiosSecure.post('/scholarships', scholarship);
      if (res.data.insertedId) {
        Swal.fire({
          title: 'Scholarship Added!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Error!',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-11/12 mx-auto py-10 flex justify-center">
      <div className="p-6 bg-white shadow-lg border border-secondary rounded-tr-2xl rounded-bl-2xl w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">Add New Scholarship</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset space-y-4">
            {/* Scholarship Name */}
            <label className="label">Scholarship Name</label>
            <input
              type="text"
              {...register('scholarshipName', { required: true })}
              className="input w-full input-bordered border-primary rounded-tr-2xl rounded-bl-2xl"
              placeholder="Scholarship Name"
            />
            {errors.scholarshipName && <p className="text-red-500">Scholarship Name is required</p>}

            {/* University Name */}
            <label className="label">University Name</label>
            <input
              type="text"
              {...register('universityName', { required: true })}
              className="input w-full input-bordered border-primary rounded-tr-2xl rounded-bl-2xl"
              placeholder="University Name"
            />
            {errors.universityName && <p className="text-red-500">University Name is required</p>}

            {/* Image */}
            <label className="label">Image</label>
            <input
              type="file"
              {...register('image', { required: true })}
              className="file-input file-input-bordered w-full border-primary rounded-tr-2xl rounded-bl-2xl"
            />
            {errors.image && <p className="text-red-500">Image is required</p>}

            {/* Country & City */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Country</label>
                <input
                  type="text"
                  {...register('country', { required: true })}
                  className="input w-full input-bordered border-primary rounded-tr-2xl rounded-bl-2xl"
                  placeholder="Country"
                />
                {errors.country && <p className="text-red-500">Country is required</p>}
              </div>
              <div>
                <label className="label">City</label>
                <input
                  type="text"
                  {...register('city', { required: true })}
                  className="input w-full input-bordered border-primary rounded-tr-2xl rounded-bl-2xl"
                  placeholder="City"
                />
                {errors.city && <p className="text-red-500">City is required</p>}
              </div>
            </div>

            {/* World Rank */}
            <label className="label">World Rank</label>
            <input
              type="number"
              {...register('worldRank', { required: true })}
              className="input w-full input-bordered border-primary rounded-tr-2xl rounded-bl-2xl"
              placeholder="World Rank"
            />
            {errors.worldRank && <p className="text-red-500">World Rank is required</p>}

            {/* Subject & Scholarship Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Subject Category</label>
                <input
                  type="text"
                  {...register('subjectCategory', { required: true })}
                  className="input w-full input-bordered border-primary rounded-tr-2xl rounded-bl-2xl"
                  placeholder="Subject Category"
                />
                {errors.subjectCategory && <p className="text-red-500">Subject Category is required</p>}
              </div>
              <div>
                <label className="label">Scholarship Category</label>
                <input
                  type="text"
                  {...register('scholarshipCategory', { required: true })}
                  className="input w-full input-bordered border-primary rounded-tr-2xl rounded-bl-2xl"
                  placeholder="Scholarship Category"
                />
                {errors.scholarshipCategory && <p className="text-red-500">Scholarship Category is required</p>}
              </div>
            </div>

            {/* Degree */}
            <label className="label">Degree</label>
            <input
              type="text"
              {...register('degree', { required: true })}
              className="input w-full input-bordered border-primary rounded-tr-2xl rounded-bl-2xl"
              placeholder="Degree"
            />
            {errors.degree && <p className="text-red-500">Degree is required</p>}

            {/* Application Fees & Service Charge */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Application Fees</label>
                <input
                  type="number"
                  {...register('applicationFees', { required: true })}
                  className="input w-full input-bordered border-primary rounded-tr-2xl rounded-bl-2xl"
                  placeholder="Application Fees"
                />
                {errors.applicationFees && <p className="text-red-500">Application Fees is required</p>}
              </div>
              <div>
                <label className="label">Service Charge</label>
                <input
                  type="number"
                  {...register('serviceCharge', { required: true })}
                  className="input w-full input-bordered border-primary rounded-tr-2xl rounded-bl-2xl"
                  placeholder="Service Charge"
                />
                {errors.serviceCharge && <p className="text-red-500">Service Charge is required</p>}
              </div>
            </div>

            {/* Total Amount */}
            <label className="label">Total Amount</label>
            <input
              type="number"
              {...register('totalAmount', { required: true })}
              className="input w-full input-bordered border-primary rounded-tr-2xl rounded-bl-2xl"
              placeholder="Total Amount"
            />
            {errors.totalAmount && <p className="text-red-500">Total Amount is required</p>}

            {/* Deadline */}
            <label className="label">Deadline</label>
            <input
              type="date"
              {...register('deadline', { required: true })}
              className="input w-full input-bordered border-primary rounded-tr-2xl rounded-bl-2xl"
            />
            {errors.deadline && <p className="text-red-500">Deadline is required</p>}

            {/* User Email (read-only) */}
            <label className="label">User Email</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="input w-full input-bordered border-primary rounded-tr-2xl rounded-bl-2xl bg-gray-100"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-secondary btn-outline mt-4 w-full text-black hover:text-white font-semibold rounded-tr-2xl rounded-bl-2xl"
            >
              {loading ? 'Adding...' : 'Add Scholarship'}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default AddScholarship;
