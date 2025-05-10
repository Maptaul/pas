import React from "react";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div
      className="hero max-w-7xl mx-auto mt-5 min-h-[60vh]  bg-cover bg-center relative rounded-md overflow-hidden "
      style={{
        backgroundImage: `url("https://i.ibb.co.com/jvFCZj4C/image7.jpg")`,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fallback color for older browsers
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 to-purple-600/50"></div>
      <div className="hero-content text-center relative z-10 animate-fade-in">
        <div className="max-w-2xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Streamline Your Passport Application
          </h1>
          <p className="text-base md:text-lg text-gray-100 mb-8 drop-shadow-md">
            Effortlessly apply for your passport with our automated system.
            Upload documents, track your application, and get started in
            minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/apply"
              className="btn btn-primary bg-purple-700 hover:bg-purple-800 text-white border-none px-6 py-3 rounded-lg font-semibold"
            >
              Apply Now
            </Link>
            <a
              href="https://epassport.gov.bd/authorization/application-status"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-purple-900 px-6 py-3 rounded-lg font-semibold"
            >
              Track Status
            </a>
            {/* <Link to="/status" className="btn btn-outline border-white text-white hover:bg-white hover:text-purple-900 px-6 py-3 rounded-lg font-semibold">
              Track Status
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
