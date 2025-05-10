import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Components/Footer";
import Loading from "../Components/Loading";
import Navbar from "../Components/Navbar";

const Root = () => {
  const location = useLocation();
  const noHeaderFooter =
    location.pathname.includes("login") || location.pathname.includes("signUp");

  // State to manage global loading
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data fetch (e.g., user authentication or system status)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        // Simulate an API call with a 2-second delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // In a real app, fetch user data, role, or system status here
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Display loading component during initial load
  if (isLoading) {
    return <Loading message="" />;
  }

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
