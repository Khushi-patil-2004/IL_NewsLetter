import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [newsletters, setNewsletters] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/newsletters")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setNewsletters(response.data);
        } else {
          console.error("Unexpected response:", response.data);
          setNewsletters([]);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.error("404: Resource not found");
        } else {
          console.error("Error fetching newsletters:", error.message);
        }
      });
  }, []);

  const deleteNewsletter = (id) => {
    axios
      .delete(`http://localhost:5000/api/newsletters/delete/${id}`)

      .then((response) => {
        setNewsletters((prev) =>
          prev.filter((newsletter) => newsletter._id !== id)
        );
        toast.success("Newsletter deleted successfully!");
      })
      .catch((error) => {
        toast.error("Error deleting newsletter!");
        console.error("Error:", error);
      });
  };

  const exportCSV = (id) => {
    axios({
      url: `http://localhost:5000/api/newsletters/${id}/export-csv`,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const blob = new Blob([response.data], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "newsletter.csv";
        link.click();
        toast.success("Newsletter exported as CSV successfully!");
      })
      .catch((error) => {
        toast.error("Error exporting CSV!");
        console.error("Error:", error);
      });
  };

  const exportPDF = (id) => {
    axios({
      url: `http://localhost:5000/api/newsletters/${id}/export-pdf`,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "newsletter.pdf";
        link.click();
        toast.success("Newsletter exported as PDF successfully!");
      })
      .catch((error) => {
        toast.error("Error exporting PDF!");
        console.error("Error:", error);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-6">
          Admin Dashboard
        </h1>
        <table className="w-full table-auto bg-white rounded-lg shadow-sm overflow-hidden">
          <thead className="bg-blue-500 text-white uppercase font-semibold">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(newsletters) && newsletters.length > 0 ? (
              newsletters.map((newsletter) => (
                <tr key={newsletter._id}>
                  <td className="px-4 py-3">{newsletter.title}</td>
                  <td className="px-4 py-3">{newsletter.description}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-between space-x-4">
                      <div className="flex-1 flex justify-between">
                        <button
                          onClick={() =>
                            (window.location.href = `/admin/event/${newsletter._id}`)
                          }
                          className="text-blue-500 px-6 py-3 bg-blue-100 rounded-lg font-medium hover:bg-blue-200 transition-all w-32"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => exportCSV(newsletter._id)}
                          className="text-blue-500 px-6 py-3 bg-blue-100 rounded-lg font-medium hover:bg-blue-200 transition-all w-32"
                        >
                          Export as CSV
                        </button>
                        <button
                          onClick={() => exportPDF(newsletter._id)}
                          className="text-blue-500 px-6 py-3 bg-blue-100 rounded-lg font-medium hover:bg-blue-200 transition-all w-32"
                        >
                          Export as PDF
                        </button>
                        <button
                          onClick={() => deleteNewsletter(newsletter._id)}
                          className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-all w-32"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No newsletters available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Link
          to="/create-newsletter"
          className="inline-block mt-6 bg-blue-500 text-white font-semibold text-lg py-3 px-6 rounded-lg hover:bg-blue-600 transition-all"
        >
          Create New Newsletter
        </Link>
      </div>
      <ToastContainer position="top-left" />
    </div>
  );
};

export default AdminDashboard;
