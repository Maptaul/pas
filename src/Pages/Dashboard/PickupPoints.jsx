import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Loading from "../../Components/Loading";

const PickupPoints = () => {
  const [pickupPoints, setPickupPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const fetchPickupPoints = async () => {
      try {
        const response = await axios.get("http://localhost:3000/applications");
        setPickupPoints(response.data || []);
      } catch (err) {
        setError("Failed to fetch pickup points. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPickupPoints();
  }, []);

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...pickupPoints].sort((a, b) => {
      if (key === "appointmentDate") {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const valueA = a[key]?.toString().toLowerCase() || "";
        const valueB = b[key]?.toString().toLowerCase() || "";
        if (valueA < valueB) return direction === "asc" ? -1 : 1;
        if (valueA > valueB) return direction === "asc" ? 1 : -1;
        return 0;
      }
    });

    setPickupPoints(sortedData);
  };

  if (loading) return <Loading />;
  if (error)
    return <div className="text-center text-red-600 py-10">{error}</div>;

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl w-full bg-white rounded-2xl shadow-xl p-8 overflow-x-auto"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Pickup Points
        </h1>
        {pickupPoints.length === 0 ? (
          <p className="text-center text-gray-500">
            No pickup points available.
          </p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th
                  className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
                  onClick={() => sortData("pickupPoint")}
                >
                  Pickup Point {/* Optional: Add arrow indicators */}
                </th>
                <th
                  className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
                  onClick={() => sortData("appointmentDate")}
                >
                  Appointment Date
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Appointment Time
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Full Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Mobile Number
                </th>
              </tr>
            </thead>
            <tbody>
              {pickupPoints.map((point, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition-all duration-300"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {point.pickupPoint || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {point.appointmentDate
                      ? new Date(point.appointmentDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {point.appointmentTime || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {point.fullName || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {point.mobileNumber || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </section>
  );
};

export default PickupPoints;
