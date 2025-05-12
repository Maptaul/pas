import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Loading from "../../Components/Loading";

const ManageDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/applications");
        const data = response.data;
        if (!Array.isArray(data)) {
          if (data && typeof data === "object" && Array.isArray(data.data)) {
            setDeliveries(data.data); // Handle nested data
          } else {
            throw new Error("Invalid data format received from server");
          }
        } else {
          setDeliveries(data); // Handle direct array
        }
      } catch (err) {
        setError(
          err.response
            ? `Server error: ${err.response.status} - ${
                err.response.data.error || "Unknown error"
              }`
            : "Network error: Failed to fetch deliveries. Please check your connection and try again."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...deliveries].sort((a, b) => {
      if (key === "appointmentDate") {
        const dateA = new Date(a[key] || 0);
        const dateB = new Date(b[key] || 0);
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const valueA = (a[key] || "").toString().toLowerCase();
        const valueB = (b[key] || "").toString().toLowerCase();
        if (valueA < valueB) return direction === "asc" ? -1 : 1;
        if (valueA > valueB) return direction === "asc" ? 1 : -1;
        return 0;
      }
    });

    setDeliveries(sortedData);
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const updatedDeliveries = deliveries.map((delivery) =>
        delivery.applicationId === applicationId
          ? { ...delivery, status: newStatus }
          : delivery
      );
      setDeliveries(updatedDeliveries);
      setStatusUpdates({ ...statusUpdates, [applicationId]: newStatus });

      // Simulate API update (replace with actual endpoint if available)
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/applications/${applicationId}`,
        {
          status: newStatus,
        }
      );
      console.log(`Updated status for ${applicationId} to ${newStatus}`);
    } catch (err) {
      setError(
        `Failed to update status for application ${applicationId}: ${err.message}`
      );
      console.error(err);
    }
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center text-red-600 py-10 text-lg font-medium">
          {error}
        </div>
      </div>
    );

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          Manage Deliveries
        </h1>
        {deliveries.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No deliveries available.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              {/* Table for larger screens */}
              <table className="w-full hidden md:table border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50 to-indigo-50 text-gray-700">
                    <th
                      className="border border-gray-200 px-4 py-3 text-left cursor-pointer font-semibold text-sm uppercase tracking-wide"
                      onClick={() => sortData("pickupPoint")}
                      aria-label="Sort by Pickup Point"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Pickup Point</span>
                        {sortConfig.key === "pickupPoint" &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUpIcon className="w-4 h-4 text-purple-600" />
                          ) : (
                            <ArrowDownIcon className="w-4 h-4 text-purple-600" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="border border-gray-200 px-4 py-3 text-left cursor-pointer font-semibold text-sm uppercase tracking-wide"
                      onClick={() => sortData("appointmentDate")}
                      aria-label="Sort by Appointment Date"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Appointment Date</span>
                        {sortConfig.key === "appointmentDate" &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUpIcon className="w-4 h-4 text-purple-600" />
                          ) : (
                            <ArrowDownIcon className="w-4 h-4 text-purple-600" />
                          ))}
                      </div>
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm uppercase tracking-wide">
                      Appointment Time
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm uppercase tracking-wide">
                      Full Name
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((delivery, index) => (
                    <motion.tr
                      key={delivery.applicationId}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-indigo-50 transition-all duration-300`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td className="border border-gray-200 px-4 py-3 text-gray-800">
                        {delivery?.pickupPoint || "N/A"}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-800">
                        {delivery?.appointmentDate
                          ? new Date(
                              delivery.appointmentDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-800">
                        {delivery?.appointmentTime || "N/A"}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-800">
                        {delivery?.fullName || "N/A"}
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <select
                          value={
                            statusUpdates[delivery.applicationId] ||
                            delivery.status ||
                            "Pending"
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              delivery.applicationId,
                              e.target.value
                            )
                          }
                          className="w-full p-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {/* Card layout for mobile screens */}
              <div
                className="md:hidden space-y-4"
                role="table"
                aria-label="Manage Deliveries Table"
              >
                {deliveries.map((delivery, index) => (
                  <motion.div
                    key={delivery.applicationId}
                    className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    role="row"
                    aria-label={`Delivery Card ${index + 1}`}
                  >
                    <div className="space-y-3">
                      <div
                        className="flex justify-between items-center"
                        role="cell"
                      >
                        <span className="text-sm font-semibold text-gray-600">
                          Pickup Point
                        </span>
                        <span className="text-sm text-gray-800">
                          {delivery?.pickupPoint || "N/A"}
                        </span>
                      </div>
                      <div
                        className="flex justify-between items-center"
                        role="cell"
                      >
                        <span className="text-sm font-semibold text-gray-600">
                          Appointment Date
                        </span>
                        <span className="text-sm text-gray-800">
                          {delivery?.appointmentDate
                            ? new Date(
                                delivery.appointmentDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div
                        className="flex justify-between items-center"
                        role="cell"
                      >
                        <span className="text-sm font-semibold text-gray-600">
                          Appointment Time
                        </span>
                        <span className="text-sm text-gray-800">
                          {delivery?.appointmentTime || "N/A"}
                        </span>
                      </div>
                      <div
                        className="flex justify-between items-center"
                        role="cell"
                      >
                        <span className="text-sm font-semibold text-gray-600">
                          Full Name
                        </span>
                        <span className="text-sm text-gray-800">
                          {delivery?.fullName || "N/A"}
                        </span>
                      </div>
                      <div
                        className="flex justify-between items-center"
                        role="cell"
                      >
                        <span className="text-sm font-semibold text-gray-600">
                          Status
                        </span>
                        <select
                          value={
                            statusUpdates[delivery.applicationId] ||
                            delivery.status ||
                            "Pending"
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              delivery.applicationId,
                              e.target.value
                            )
                          }
                          className="w-32 p-1 rounded-md border border-gray-300 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
};

export default ManageDeliveries;
