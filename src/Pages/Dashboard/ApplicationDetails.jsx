import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ApplicationDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/applications/${id}`
        );
        setApplication(response.data);
      } catch (err) {
        setError("Failed to fetch application details.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-600 py-10">{error}</div>;
  if (!application)
    return <div className="text-center py-10">No data found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
      <Link
        to="/dashboard/pickup-points"
        className="text-blue-600 underline mb-4 inline-block"
      >
        &larr; Back
      </Link>
      <h2 className="text-2xl font-bold mb-4 text-purple-700">
        Application Details
      </h2>
      <div className="space-y-2">
        {Object.entries(application).map(([key, value]) => (
          <div key={key}>
            <span className="font-semibold capitalize">
              {key.replace(/([A-Z])/g, " $1")}:
            </span>{" "}
            <span>
              {typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)
                ? new Date(value).toLocaleString()
                : value?.toString() || "N/A"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationDetails;
