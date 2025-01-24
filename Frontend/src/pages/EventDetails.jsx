import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Circles } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";
import facebookIcon from "../assets/event/facebook.png";
import twitterIcon from "../assets/event/twitter.png";
import instagramIcon from "../assets/event/instagram.png";
import logo from "../assets/event/logo.png";

const Newsletter = () => {
  const { id } = useParams();
  const [newsletter, setNewsletter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rsvps, setRsvps] = useState([]);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/newsletters/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched newsletter data:", data);
        setNewsletter(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching newsletter:", error);
        toast.error("Error fetching newsletter. Please try again.");
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Circles height="50" width="50" color="#6B46C1" ariaLabel="loading" />
      </div>
    );
  }
  const handleRSVP = (event) => {
    event.preventDefault();
    const studentName = event.target.studentName.value;
    const studentEmail = event.target.studentEmail.value;
    const submitButton = event.target.querySelector("button");
    submitButton.disabled = true;
    console.log("RSVP submitted with name:", studentName);
    fetch(`http://localhost:5000/api/newsletter/${newsletter._id}/rsvp`, {
      method: "POST",
      body: JSON.stringify({ studentName, studentEmail }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            console.error("RSVP Error:", data);
            throw new Error(data.error || "RSVP failed.");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("RSVP Success:", data);
        toast.success("Thanks for your RSVP!");
        setRsvps((prevRsvps) => [...prevRsvps, { studentName, studentEmail }]);
        setTimeout(() => navigate("/student/news"), 2000);
      })
      .catch((error) => {
        console.error("Error submitting RSVP:", error);
        toast.error(
          error.message || "Error submitting RSVP. Please try again."
        );
      })
      .finally(() => {
        submitButton.disabled = false;
      });
  };

  return (
    <div className="container mx-auto px-5 py-6">
      <header className="flex flex-col items-center justify-center py-8">
        <div className="logo flex justify-center items-center">
          <img src={logo} alt="IDEALab Logo" className="w-36 h-48" />
        </div>

        <h1 className="text-xl text-blue-500 mt-5">PRESENTS</h1>
      </header>

      <section className="main-section bg-white p-5 rounded-lg shadow-md mb-5">
        <div className="banner">
          <img
            src={
              newsletter.banner
                ? `http://localhost:5000/uploads/${newsletter.banner}`
                : "/images/default-banner.jpg"
            }
            alt="Banner"
            className="w-full max-h-96 object-cover rounded-lg"
          />
        </div>
        <div className="content text-center py-5">
          <h3 className="text-xl mb-3 font-bold">OVERVIEW</h3>
          <p className="text-base text-gray-700 leading-6">
            {newsletter.description}
          </p>
        </div>
      </section>

      <section className="image-and-guidelines flex gap-5 mb-5">
        <div className="poster flex-1 flex justify-center items-center">
          <img
            src={
              newsletter.poster
                ? `http://localhost:5000/uploads/${newsletter.poster}`
                : "/images/default-poster.jpg"
            }
            alt="Poster"
            className="w-full h-full object-contain rounded-lg shadow-md"
          />
        </div>

        <div className="guidelines flex-1 flex flex-col justify-between bg-transparent p-5 rounded-lg shadow-md">
          <h3 className="text-center font-bold">GUIDELINES</h3>
          <ul className="list-disc pl-5 text-left">
            {newsletter.guidelines.split("\n").map((guideline, index) => (
              <li key={index}>{guideline}</li>
            ))}
          </ul>

          <h3 className="text-center font-bold">DETAILS</h3>
          <ul>
            <li>
              <strong>Prizes:</strong> {newsletter.prizes}
            </li>
            <li>
              <strong>Key Dates:</strong> {newsletter.keyDates}
            </li>
            <li>
              <strong>Registration Link:</strong>
              <a
                href={newsletter.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                Register Here
              </a>
            </li>
            <li>
              <strong>Contact:</strong> {newsletter.contactInfo}
            </li>
          </ul>
        </div>
      </section>
      <section className="rsvp bg-rspv bg-cover bg-center p-10 rounded-lg mt-5 shadow-md">
        <form onSubmit={handleRSVP} className="max-w-lg mx-auto">
          <input
            type="email"
            name="studentEmail"
            placeholder="Your Email"
            required
            className="w-full p-3 mb-5 border border-white rounded-lg bg-gray-200 text-gray-700 focus:outline-none focus:border-white"
          />
          <input
            type="text"
            name="studentName"
            placeholder="Your Name"
            required
            className="w-full p-3 mb-5 border border-white rounded-lg bg-gray-200 text-gray-700 focus:outline-none focus:border-white"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-black py-2 px-5 rounded-md text-xl hover:bg-yellow-400 transition duration-300"
          >
            RSVP!!!
          </button>
        </form>
      </section>

      <footer className="text-center py-8 bg-gray-800 text-white mt-10 rounded-b-lg">
        <div className="social-media flex justify-center space-x-6 mb-4">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img src={facebookIcon} alt="Facebook" className="w-10 h-10" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img src={twitterIcon} alt="Twitter" className="w-10 h-10" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img src={instagramIcon} alt="Instagram" className="w-10 h-10" />
          </a>
        </div>
        <p className="text-lg">All Rights Reserved.</p>
      </footer>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default Newsletter;
