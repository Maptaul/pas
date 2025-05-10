import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I apply for a passport using PAS?",
      answer:
        "To apply for a passport, register on our platform, log in, and navigate to the 'Apply Passport' section. Fill out the required details, upload necessary documents, and submit your application. You'll receive updates on your application status via email.",
    },
    {
      question:
        "What is the difference between ShapOSS and PassportOffice roles?",
      answer:
        "ShapOSS users are applicants who can apply for passports and track their application status. PassportOffice users are administrators who review and process passport applications, ensuring all documents meet the requirements.",
    },
    {
      question: "How can I contact support if I have an issue?",
      answer:
        "You can reach out to our support team via the 'Contact Us' page. Fill out the form with your query, and we'll respond within 24-48 hours. Alternatively, email us directly at support@pas.com.",
    },
    {
      question: "What should I do if I forget my password?",
      answer:
        "Click on the 'Forgot Password?' link on the login page, enter your email address, and we'll send you a link to reset your password. Follow the instructions in the email to create a new password.",
    },
    {
      question: "How long does it take to process a passport application?",
      answer:
        "The processing time varies depending on the application type and verification requirements. Typically, it takes 4-6 weeks for a standard application. You can track your application status on the dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-600 mb-12 font-poppins">
          Frequently Asked Questions
        </h1>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border border-gray-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-semibold text-gray-800 hover:text-purple-600 transition-colors font-poppins"
              >
                {faq.question}
                {openIndex === index ? (
                  <FaChevronUp className="text-purple-600" />
                ) : (
                  <FaChevronDown className="text-purple-600" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <p className="text-gray-600 font-poppins">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
