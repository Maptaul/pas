import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

const Root = () => {
  return (
    <div className="bg-base-200 ">
      <header>
        <Navbar />
      </header>
      <main className="pt-20 bg-base-200 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Root;
