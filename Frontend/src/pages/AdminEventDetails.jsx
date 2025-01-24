import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Circles } from "react-loader-spinner";
import facebookIcon from "../assets/event/facebook.png";
import twitterIcon from "../assets/event/twitter.png";
import instagramIcon from "../assets/event/instagram.png";
import RSPVP from "../assets/event/RSPV.jpg";
import logo from "../assets/event/logo.png";

const Newsletter = () => {
  const { id } = useParams();
  const [newsletter, setNewsletter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/newsletters/${id}`)
      .then((response) => response.json())
      .then((data) => {
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
                : RSPVP
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
                : RSPVP
            }
            alt="Poster"
            className="w-full h-full object-contain rounded-lg shadow-md"
          />
        </div>

        <div className="guidelines flex-1 flex flex-col justify-between bg-transparent p-5 rounded-lg shadow-md">
          <h3 className="text-center font-bold ">GUIDELINES</h3>
          <ul className="list-disc pl-5 text-left">
            {newsletter.guidelines.split("\n").map((guideline, index) => (
              <li key={index}>{guideline}</li>
            ))}
          </ul>

          <h3 className=" text-center font-bold">DETAILS</h3>
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
    </div>
  );
};

export default Newsletter;
