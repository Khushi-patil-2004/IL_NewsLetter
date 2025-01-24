import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CreateNewsletter = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    theme: "",
    guidelines: "",
    prizes: "",
    keyDates: "",
    registrationLink: "",
    contactInfo: "",
    capacity: "",
    poster: null,
    banner: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "poster" || key === "banner") {
        data.append(key, formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });

    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    axios
      .post("http://localhost:5000/api/newsletters", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        toast.success("Newsletter created successfully");

        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000); // 2 seconds delay before redirect
      })
      .catch((error) => {
        console.error(
          "Error creating newsletter:",
          error.response?.data || error.message
        );
        toast.error("Error creating newsletter");
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="max-w-3xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg"
    >
      <h1 className="text-center text-2xl font-semibold text-blue-600 mb-6">
        Create New Newsletter
      </h1>

      <label className="block text-blue-600 mb-2">Title</label>
      <input
        type="text"
        name="title"
        onChange={handleChange}
        required
        className="w-full p-3 mb-4 border border-gray-300 rounded-md"
      />

      <label className="block text-blue-600 mb-2">Description</label>
      <textarea
        name="description"
        onChange={handleChange}
        required
        className="w-full p-3 mb-4 border border-gray-300 rounded-md"
      ></textarea>

      <label className="block text-blue-600 mb-2">Theme</label>
      <input
        type="text"
        name="theme"
        onChange={handleChange}
        className="w-full p-3 mb-4 border border-gray-300 rounded-md"
      />

      <label className="block text-blue-600 mb-2">Guidelines</label>
      <textarea
        name="guidelines"
        onChange={handleChange}
        className="w-full p-3 mb-4 border border-gray-300 rounded-md"
      ></textarea>

      <label className="block text-blue-600 mb-2">Prizes</label>
      <textarea
        name="prizes"
        onChange={handleChange}
        className="w-full p-3 mb-4 border border-gray-300 rounded-md"
      />

      <label className="block text-blue-600 mb-2">Key Dates</label>
      <textarea
        name="keyDates"
        onChange={handleChange}
        className="w-full p-3 mb-4 border border-gray-300 rounded-md"
      />

      <label className="block text-blue-600 mb-2">Registration Link</label>
      <input
        type="url"
        name="registrationLink"
        onChange={handleChange}
        className="w-full p-3 mb-4 border border-gray-300 rounded-md"
      />

      <label className="block text-blue-600 mb-2">Contact Info</label>
      <input
        type="text"
        name="contactInfo"
        onChange={handleChange}
        className="w-full p-3 mb-4 border border-gray-300 rounded-md"
      />

      <label className="block text-blue-600 mb-2">Capacity</label>
      <input
        type="number"
        name="capacity"
        onChange={handleChange}
        className="w-full p-3 mb-4 border border-gray-300 rounded-md"
      />

      <label className="block text-blue-600 mb-2">Poster</label>
      <input
        type="file"
        name="poster"
        onChange={handleChange}
        className="w-full p-3 mb-4 border border-gray-300 rounded-md"
      />

      <label className="block text-blue-600 mb-2">Banner</label>
      <input
        type="file"
        name="banner"
        onChange={handleChange}
        className="w-full p-3 mb-4 border border-gray-300 rounded-md"
      />

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-300"
      >
        Create Newsletter
      </button>

      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
      />
    </form>
  );
};

export default CreateNewsletter;
