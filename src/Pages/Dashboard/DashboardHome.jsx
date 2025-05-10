import React, { useContext } from "react";
import { AuthContext } from "../../Providers/AuthProvider";

const DashboardHome = () => {
  const { user, role } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-8">
      <div className="bg-gradient-to-r from-purple-200 to-purple-400 p-8 rounded-xl shadow-lg max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-poppins">
          Welcome, {user?.displayName || "User"}!
        </h1>
        <p className="text-lg md:text-xl text-gray-700 font-poppins">
          {role === "PassportOffice"
            ? "Ready to manage passport applications and streamline processes? Dive into your dashboard!"
            : "Your hub for managing deliveries and pickup points. Let’s get started!"}
        </p>
        <div className="mt-6">
          <img
            src={user?.photoURL || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-purple-300 mx-auto shadow-md object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
