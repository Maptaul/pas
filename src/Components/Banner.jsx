import React from "react";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="hero min-h-[60vh] pt-20 bg-cover bg-center inset-0 bg-gradient-to-b from-purple-900/50 to-purple-600/70 relative rounded-md overflow-hidden">
      <div className="absolute inset-0 "></div>
      <div className="hero-content text-center relative z-10 animate-fade-in">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Simplify Your Passport Application
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 drop-shadow-md">
            Apply for your passport seamlessly with our Passport Automation
            System. Upload your documents, track your application, and get
            started in just a few clicks.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/apply-passport" className="btn btn-primary btn-purple">
              Apply Now
            </Link>
            <a
              href="https://epassport.gov.bd/authorization/application-status"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Track Status
            </a>
            {/* <Link to="/status" className="btn btn-outline btn-purple">
              Track Status
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
