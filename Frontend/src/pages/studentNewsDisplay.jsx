import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "react-feather";

const StudentNewsDisplay = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/newsletters")
      .then((response) => response.json())
      .then((data) => {
        setNewsletters(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching newsletters:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (newsletters.length > 0) {
      const interval = setInterval(() => {
        setDirection("next");
        setCurrentIndex((prevIndex) =>
          prevIndex === newsletters.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [newsletters]);

  const handlePrev = () => {
    setDirection("prev");
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? newsletters.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setDirection("next");
    setCurrentIndex((prevIndex) =>
      prevIndex === newsletters.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-3xl font-bold mb-8">
        Upcoming Lab Events
      </h1>

      {/* Slider Container */}
      <div className="relative w-full h-128 overflow-hidden rounded-lg">
        <div
          className={`flex transition-transform duration-700 ease-in-out ${
            direction === "next"
              ? "transform translate-x-0"
              : "transform -translate-x-0"
          }`}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {newsletters.map((newsletter, index) => (
            <div
              key={newsletter._id}
              className="w-full h-full flex-shrink-0 transition-transform transform"
              onClick={() =>
                navigate(`/student/event-details/${newsletter._id}`)
              }
            >
              <img
                src={`http://localhost:5000/uploads/${newsletter.banner}`}
                alt={newsletter.title}
                className="w-full h-full object-cover rounded-lg transition-all duration-700 ease-in-out cursor-pointer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <button
            onClick={handlePrev}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-200 transition-all duration-300"
          >
            <ChevronLeft size={30} />
          </button>
          <button
            onClick={handleNext}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-200 transition-all duration-300"
          >
            <ChevronRight size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentNewsDisplay;
