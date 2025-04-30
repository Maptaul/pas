import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

const Root = () => {
  const location = useLocation();
  const noHeaderFooter =
    location.pathname.includes("login") || location.pathname.includes("signUp");
  return (
    <div className="bg-base-200 min-h-screen">
      {noHeaderFooter || (
        <header>
          <Navbar />
        </header>
      )}
      <main className="min-h-screen">
        <Outlet />
      </main>
      {noHeaderFooter || <Footer />}
    </div>
  );
};

export default Root;
