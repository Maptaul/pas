import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <section className="page_404 py-10 bg-white min-h-screen flex items-center justify-center">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 text-center">
            <div
              className="four_zero_four_bg h-[400px] bg-cover bg-center"
              style={{
                backgroundImage: `url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)`,
              }}
            >
              <h1 className="text-8xl text-gray-800 pt-20">404</h1>
            </div>

            <div className="contant_box_404 -mt-12">
              <h3 className="text-5xl sm:text-6xl text-gray-800 mb-4">
                Look like you're lost
              </h3>
              <p className="text-gray-600 mb-6">
                The page you are looking for is not available!
              </p>
              <Link to="/" className="btn btn-purple link_404">
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
