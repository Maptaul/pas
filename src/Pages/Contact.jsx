import React, { useState } from "react";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("Please fill in all fields!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    toast.success("Your message has been sent successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="container w-11/12 mx-auto p-4 pt-10 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-purple-600 font-poppins">
          Contact Us
        </h1>
        <p className="mt-4 text-gray-600 font-poppins">
          We're here to assist you with your passport application. Reach out to
          us!
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="card bg-base-100 shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4 font-poppins">
            Send Us a Message
          </h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-poppins">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-poppins">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-poppins">Subject</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Enter the subject"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-poppins">Message</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Enter your message"
                className="textarea textarea-bordered w-full h-32"
                required
              />
            </div>
            <button
              onClick={handleSubmit}
              className="btn btn-primary btn-purple w-full mt-4 hover:bg-purple-700 transition-colors duration-300"
            >
              Send Message
            </button>
          </div>
        </div>

        {/* Contact Information and Map */}
        <div className="space-y-8">
          {/* Contact Info */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-purple-600 mb-4 font-poppins">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.243l-4.243-4.243m0 0L9.172 7.757M13.414 12l4.243-4.243M13.414 12l-4.243 4.243M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-700 font-poppins">
                  <strong>Address:</strong> 4th Floor, IPL City Centre, Holding
                  No. 162, O. R. Nizam Road, <br /> Goal Pahar, PS: Panchlaish,
                  District:- Chattogram, Bangladesh.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <p className="text-gray-700 font-poppins">
                  <strong>Phone:</strong> +88 0196 995 9999
                </p>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-700 font-poppins">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:contact@jionex.com"
                    className="text-purple-600 hover:underline"
                  >
                    contact@jionex.com
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-6">
              <a
                href="/faq"
                className="btn btn-outline btn-purple w-full hover:bg-purple-600 hover:text-white transition-colors duration-300"
              >
                Visit Our FAQ Page
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-purple-600 mb-4 font-poppins">
              Our Location
            </h2>
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3050.8583213141446!2d91.82386513862224!3d22.359027994911116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd9b8276b358b%3A0xd94e54a6f764b511!2sIPL%20City%20Center%20step%20show%20Room.!5e1!3m2!1sen!2sbd!4v1745922545234!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
