import axios from "axios";
import { getAuth } from "firebase/auth"; // Import Firebase auth
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const PassportApplicationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    passportType: "",
    onlineRegistrationNumber: "",
    fullName: "",
    dateOfBirth: "",
    mobileNumber: "",
    previousPassport: "",
    reissueReason: "",
    otherReason: "",
    passportNumber: "",
    issueDate: "",
    expiryDate: "",
    passportPages: "48",
    validity: "5",
    deliveryType: "",
    appointmentDate: "",
    appointmentTime: "16:30",
    pickupPoint: "",
  });
  const [files, setFiles] = useState({
    applicationCopy: null,
    nidBirthCertificate: null,
    nidOnlineCopy: null,
    studentJobCard: null,
    fatherNidBirthCertificate: null,
    motherNidBirthCertificate: null,
    utilityBillCopy: null,
    previousPassport: null,
    landRegister: null,
    citizenshipCertificate: null,
    onlineGD: null,
  });
  const [fileUrls, setFileUrls] = useState({
    applicationCopy: "",
    nidBirthCertificate: "",
    nidOnlineCopy: "",
    studentJobCard: "",
    fatherNidBirthCertificate: "",
    motherNidBirthCertificate: "",
    utilityBillCopy: "",
    previousPassport: "",
    landRegister: "",
    citizenshipCertificate: "",
    onlineGD: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "appointmentDate" || name === "appointmentTime") {
      const dateValue =
        name === "appointmentDate" ? value : formData.appointmentDate;
      const timeValue =
        name === "appointmentTime" ? value : formData.appointmentTime;

      const excludedTimes = ["17:00", "17:30", "18:30", "19:30"];
      if (excludedTimes.includes(timeValue)) {
        toast.error(
          "Selected time is unavailable. Please choose a different time.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        setFormData((prev) => ({ ...prev, appointmentTime: "16:30" }));
        return;
      }

      if (dateValue && timeValue) {
        const [year, month, day] = dateValue.split("-");
        const [hours, minutes] = timeValue.split(":");
        const date = new Date(year, month - 1, day, hours, minutes);
        const formattedDate = date.toISOString(); // Store in ISO format for backend
        setFormData((prev) => ({ ...prev, appointmentDate: formattedDate }));
      }
    }
  };

  const handleFileChange = async (e) => {
    const { name, files: uploadedFiles } = e.target;
    const selectedFile = uploadedFiles[0];
    if (!selectedFile) return;

    const validTypes = ["image/jpeg", "image/jpg", "application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Please upload a valid file (JPEG, JPG, or PDF).", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (selectedFile.size > maxSize) {
      toast.error("File size exceeds 5MB. Please upload a smaller file.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${image_hosting_key}`,
        formData
      );
      setFileUrls((prev) => ({ ...prev, [name]: res.data.data.display_url }));
      setFiles((prev) => ({ ...prev, [name]: selectedFile }));
      toast.success("File uploaded successfully.", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to upload file. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteFile = (name) => {
    setFiles((prev) => ({ ...prev, [name]: null }));
    setFileUrls((prev) => ({ ...prev, [name]: "" }));
  };

  const handleViewFile = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.passportType) {
        toast.error("Please select a passport type.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      if (formData.passportType !== "Ordinary") {
        toast.info("Please contact your authority to proceed.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }
    if (
      step === 2 &&
      (!formData.onlineRegistrationNumber ||
        !formData.fullName ||
        !formData.dateOfBirth ||
        !formData.mobileNumber)
    ) {
      toast.error("Please fill in all personal information fields.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (step === 3 && !formData.previousPassport) {
      toast.error("Please select an option for previous passport.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (
      step === 3 &&
      formData.previousPassport.startsWith("Yes") &&
      (!formData.reissueReason ||
        !formData.passportNumber ||
        !formData.issueDate ||
        !formData.expiryDate)
    ) {
      toast.error("Please fill in all previous passport details.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (
      step === 3 &&
      formData.reissueReason === "Other" &&
      !formData.otherReason
    ) {
      toast.error("Please explain the reason for your passport request.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (step === 4 && (!formData.passportPages || !formData.validity)) {
      toast.error("Please select passport options.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (
      step === 5 &&
      (!fileUrls.applicationCopy ||
        !fileUrls.nidBirthCertificate ||
        !fileUrls.nidOnlineCopy ||
        !fileUrls.fatherNidBirthCertificate ||
        !fileUrls.motherNidBirthCertificate ||
        !fileUrls.utilityBillCopy ||
        !fileUrls.landRegister ||
        !fileUrls.citizenshipCertificate)
    ) {
      toast.error("Please upload all required documents.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (
      step === 6 &&
      (!formData.deliveryType ||
        !formData.appointmentDate ||
        !formData.appointmentTime)
    ) {
      toast.error(
        "Please select a delivery type and an appointment date/time.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }
    if (step === 7 && !formData.pickupPoint) {
      toast.error("Please select a pickup point.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.passportType ||
      !formData.onlineRegistrationNumber ||
      !formData.fullName ||
      !formData.dateOfBirth ||
      !formData.mobileNumber ||
      !formData.previousPassport ||
      !formData.passportPages ||
      !formData.validity ||
      !formData.deliveryType ||
      !formData.appointmentDate ||
      !formData.pickupPoint ||
      !fileUrls.applicationCopy ||
      !fileUrls.nidBirthCertificate ||
      !fileUrls.nidOnlineCopy ||
      !fileUrls.fatherNidBirthCertificate ||
      !fileUrls.motherNidBirthCertificate ||
      !fileUrls.utilityBillCopy ||
      !fileUrls.landRegister ||
      !fileUrls.citizenshipCertificate
    ) {
      toast.error(
        "Please complete all steps and upload all required documents.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit your passport application?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#a855f7",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
          if (!user) {
            toast.error("Please log in to submit the application.", {
              position: "top-right",
              autoClose: 3000,
            });
            return;
          }
          const token = await user.getIdToken(); // Get Firebase JWT token

          const applicationData = {
            ...formData,
            files: fileUrls,
            createdAt: new Date().toISOString(),
          };

          const response = await axios.post(
            `${API_URL}/applications`,
            applicationData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const { applicationId } = response.data;
          setApplicationId(applicationId);
          setSubmitted(true);
          toast.success(
            `Application submitted successfully! Application ID: ${applicationId}`,
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
        } catch (error) {
          console.error("Submission error:", error);
          const errorMessage =
            error.response?.data?.error ||
            error.message ||
            "Failed to submit application.";
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    });
  };

  const calculateBasePrice = () => {
    if (formData.passportPages === "64" && formData.validity === "10") {
      return 8625;
    }
    return 6325;
  };

  const calculateDeliveryPrice = () => {
    let basePrice = calculateBasePrice();
    if (formData.deliveryType === "Express") {
      basePrice = 8625;
    }
    return basePrice;
  };

  const handlePrint = () => {
    const printContent = document.querySelector(
      "#confirmation-page .card-body"
    ).innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleDownload = async () => {
    const element = document.getElementById("confirmation-page");
    if (!element) {
      console.error("Confirmation page element not found!");
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Passport_Application_${applicationId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download PDF: " + error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto p-4 pt-16">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-600 font-poppins">
          Application Confirmation
        </h1>
        <div id="confirmation-page" className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-3 text-gray-800 font-poppins">
                Application Details
              </h2>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Application ID
                  </h3>
                  <p className="text-gray-700 font-poppins">{applicationId}</p>
                </div>
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Passport Type
                  </h3>
                  <p className="text-gray-700 font-poppins">
                    {formData.passportType}
                  </p>
                </div>
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Personal Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700 font-poppins">
                      <strong>Online Registration Number:</strong>{" "}
                      {formData.onlineRegistrationNumber}
                    </p>
                    <p className="text-gray-700 font-poppins">
                      <strong>Full Name:</strong> {formData.fullName}
                    </p>
                    <p className="text-gray-700 font-poppins">
                      <strong>Date of Birth:</strong> {formData.dateOfBirth}
                    </p>
                    <p className="text-gray-700 font-poppins">
                      <strong>Mobile Number:</strong> {formData.mobileNumber}
                    </p>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Previous Passport
                  </h3>
                  <p className="text-gray-700 font-poppins">
                    <strong>Has Previous Passport:</strong>{" "}
                    {formData.previousPassport === "Yes-MRP"
                      ? "Yes, I have a Machine Readable Passport (MRP)"
                      : formData.previousPassport === "Yes-ePP"
                      ? "Yes, I have an Electronic Passport (ePP)"
                      : "No, I don't have any previous passport / handwritten passport"}
                  </p>
                  {formData.previousPassport.startsWith("Yes") && (
                    <>
                      <p className="text-gray-700 font-poppins">
                        <strong>Reissue Reason:</strong>{" "}
                        {formData.reissueReason}
                      </p>
                      {formData.reissueReason === "Other" && (
                        <p className="text-gray-700 font-poppins">
                          <strong>Explanation:</strong> {formData.otherReason}
                        </p>
                      )}
                      <p className="text-gray-700 font-poppins">
                        <strong>Passport Number:</strong>{" "}
                        {formData.passportNumber}
                      </p>
                      <p className="text-gray-700 font-poppins">
                        <strong>Issue Date:</strong> {formData.issueDate}
                      </p>
                      <p className="text-gray-700 font-poppins">
                        <strong>Expiry Date:</strong> {formData.expiryDate}
                      </p>
                    </>
                  )}
                </div>
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Passport Options
                  </h3>
                  <p className="text-gray-700 font-poppins">
                    <strong>Passport Pages:</strong> {formData.passportPages}{" "}
                    pages
                  </p>
                  <p className="text-gray-700 font-poppins">
                    <strong>Validity:</strong> {formData.validity} years
                  </p>
                </div>
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Documents
                  </h3>
                  <p className="text-gray-700 font-poppins flex items-center justify-between">
                    <span>
                      <strong>Application Copy:</strong>{" "}
                      {fileUrls.applicationCopy ? "Uploaded" : "Not uploaded"}
                    </span>
                    {fileUrls.applicationCopy && (
                      <button
                        onClick={() => handleViewFile(fileUrls.applicationCopy)}
                        className="btn btn-sm btn-outline btn-purple"
                      >
                        View
                      </button>
                    )}
                  </p>
                  <p className="text-gray-700 font-poppins flex items-center justify-between">
                    <span>
                      <strong>NID/Birth Certificate:</strong>{" "}
                      {fileUrls.nidBirthCertificate
                        ? "Uploaded"
                        : "Not uploaded"}
                    </span>
                    {fileUrls.nidBirthCertificate && (
                      <button
                        onClick={() =>
                          handleViewFile(fileUrls.nidBirthCertificate)
                        }
                        className="btn btn-sm btn-outline btn-purple"
                      >
                        View
                      </button>
                    )}
                  </p>
                  <p className="text-gray-700 font-poppins flex items-center justify-between">
                    <span>
                      <strong>NID Online Copy:</strong>{" "}
                      {fileUrls.nidOnlineCopy ? "Uploaded" : "Not uploaded"}
                    </span>
                    {fileUrls.nidOnlineCopy && (
                      <button
                        onClick={() => handleViewFile(fileUrls.nidOnlineCopy)}
                        className="btn btn-sm btn-outline btn-purple"
                      >
                        View
                      </button>
                    )}
                  </p>
                  <p className="text-gray-700 font-poppins flex items-center justify-between">
                    <span>
                      <strong>Student/Job Card:</strong>{" "}
                      {fileUrls.studentJobCard ? "Uploaded" : "Not uploaded"}
                    </span>
                    {fileUrls.studentJobCard && (
                      <button
                        onClick={() => handleViewFile(fileUrls.studentJobCard)}
                        className="btn btn-sm btn-outline btn-purple"
                      >
                        View
                      </button>
                    )}
                  </p>
                  <p className="text-gray-700 font-poppins flex items-center justify-between">
                    <span>
                      <strong>Father NID/Birth Certificate:</strong>{" "}
                      {fileUrls.fatherNidBirthCertificate
                        ? "Uploaded"
                        : "Not uploaded"}
                    </span>
                    {fileUrls.fatherNidBirthCertificate && (
                      <button
                        onClick={() =>
                          handleViewFile(fileUrls.fatherNidBirthCertificate)
                        }
                        className="btn btn-sm btn-outline btn-purple"
                      >
                        View
                      </button>
                    )}
                  </p>
                  <p className="text-gray-700 font-poppins flex items-center justify-between">
                    <span>
                      <strong>Mother NID/Birth Certificate:</strong>{" "}
                      {fileUrls.motherNidBirthCertificate
                        ? "Uploaded"
                        : "Not uploaded"}
                    </span>
                    {fileUrls.motherNidBirthCertificate && (
                      <button
                        onClick={() =>
                          handleViewFile(fileUrls.motherNidBirthCertificate)
                        }
                        className="btn btn-sm btn-outline btn-purple"
                      >
                        View
                      </button>
                    )}
                  </p>
                  <p className="text-gray-700 font-poppins flex items-center justify-between">
                    <span>
                      <strong>Utility Bill Copy:</strong>{" "}
                      {fileUrls.utilityBillCopy ? "Uploaded" : "Not uploaded"}
                    </span>
                    {fileUrls.utilityBillCopy && (
                      <button
                        onClick={() => handleViewFile(fileUrls.utilityBillCopy)}
                        className="btn btn-sm btn-outline btn-purple"
                      >
                        View
                      </button>
                    )}
                  </p>
                  <p className="text-gray-700 font-poppins flex items-center justify-between">
                    <span>
                      <strong>Previous Passport:</strong>{" "}
                      {fileUrls.previousPassport ? "Uploaded" : "Not uploaded"}
                    </span>
                    {fileUrls.previousPassport && (
                      <button
                        onClick={() =>
                          handleViewFile(fileUrls.previousPassport)
                        }
                        className="btn btn-sm btn-outline btn-purple"
                      >
                        View
                      </button>
                    )}
                  </p>
                  <p className="text-gray-700 font-poppins flex items-center justify-between">
                    <span>
                      <strong>Land Register:</strong>{" "}
                      {fileUrls.landRegister ? "Uploaded" : "Not uploaded"}
                    </span>
                    {fileUrls.landRegister && (
                      <button
                        onClick={() => handleViewFile(fileUrls.landRegister)}
                        className="btn btn-sm btn-outline btn-purple"
                      >
                        View
                      </button>
                    )}
                  </p>
                  <p className="text-gray-700 font-poppins flex items-center justify-between">
                    <span>
                      <strong>Citizenship Certificate:</strong>{" "}
                      {fileUrls.citizenshipCertificate
                        ? "Uploaded"
                        : "Not uploaded"}
                    </span>
                    {fileUrls.citizenshipCertificate && (
                      <button
                        onClick={() =>
                          handleViewFile(fileUrls.citizenshipCertificate)
                        }
                        className="btn btn-sm btn-outline btn-purple"
                      >
                        View
                      </button>
                    )}
                  </p>
                  <p className="text-gray-700 font-poppins flex items-center justify-between">
                    <span>
                      <strong>Online GD:</strong>{" "}
                      {fileUrls.onlineGD ? "Uploaded" : "Not uploaded"}
                    </span>
                    {fileUrls.onlineGD && (
                      <button
                        onClick={() => handleViewFile(fileUrls.onlineGD)}
                        className="btn btn-sm btn-outline btn-purple"
                      >
                        View
                      </button>
                    )}
                  </p>
                </div>
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Delivery Options
                  </h3>
                  <p className="text-gray-700 font-poppins">
                    <strong>Delivery Type:</strong> {formData.deliveryType}
                  </p>
                  <p className="text-gray-700 font-poppins">
                    <strong>Appointment Date & Time:</strong>{" "}
                    {new Date(formData.appointmentDate).toLocaleString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }
                    )}
                  </p>
                </div>
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Pickup Point
                  </h3>
                  <p className="text-gray-700 font-poppins">
                    {formData.pickupPoint}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Total Price
                  </h3>
                  <p className="text-gray-700 font-poppins">
                    {calculateDeliveryPrice()} BDT
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <QRCodeCanvas
                  id="qr-code"
                  value={`Application ID: ${applicationId}`}
                  size={128}
                />
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={handlePrint}
                  className="btn btn-primary btn-purple"
                >
                  Print
                </button>
                <button
                  onClick={handleDownload}
                  className="btn btn-primary btn-purple"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-16">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-600 font-poppins">
        Passport Application Form
      </h1>
      <div className="card w-11/12 mx-auto bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-center mb-6">
            <div className="steps">
              <div className={`step ${step >= 1 ? "step-primary" : ""}`}>
                Passport Type
              </div>
              <div className={`step ${step >= 2 ? "step-primary" : ""}`}>
                Personal Information
              </div>
              <div className={`step ${step >= 3 ? "step-primary" : ""}`}>
                Previous Passport
              </div>
              <div className={`step ${step >= 4 ? "step-primary" : ""}`}>
                Passport Options
              </div>
              <div className={`step ${step >= 5 ? "step-primary" : ""}`}>
                Documents
              </div>
              <div className={`step ${step >= 6 ? "step-primary" : ""}`}>
                Delivery Options
              </div>
              <div className={`step ${step >= 7 ? "step-primary" : ""}`}>
                Pickup Point
              </div>
              <div className={`step ${step >= 8 ? "step-primary" : ""}`}>
                Review & Submit
              </div>
            </div>
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800 font-poppins">
                Passport Type Untersuch
              </h2>
              <p className="text-gray-600 mb-6 font-poppins">
                Select the Passport Type for your application.
              </p>
              <div className="form-control space-y-4">
                <label className="label cursor-pointer flex items-center gap-3">
                  <input
                    type="radio"
                    name="passportType"
                    value="Ordinary"
                    checked={formData.passportType === "Ordinary"}
                    onChange={handleInputChange}
                    className="radio radio-primary w-5 h-5"
                  />
                  <span className="label-text text-gray-700 font-poppins">
                    Ordinary Passport
                  </span>
                </label>
                <label className="label cursor-pointer flex items-center gap-3">
                  <input
                    type="radio"
                    name="passportType"
                    value="Official"
                    checked={formData.passportType === "Official"}
                    onChange={handleInputChange}
                    className="radio radio-primary w-5 h-5"
                  />
                  <span className="label-text text-gray-700 font-poppins">
                    Official Passport
                  </span>
                </label>
                <label className="label cursor-pointer flex items-center gap-3">
                  <input
                    type="radio"
                    name="passportType"
                    value="Diplomatic"
                    checked={formData.passportType === "Diplomatic"}
                    onChange={handleInputChange}
                    className="radio radio-primary w-5 h-5"
                  />
                  <span className="label-text text-gray-700 font-poppins">
                    Diplomatic Passport
                  </span>
                </label>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={nextStep}
                  className="btn btn-primary btn-purple"
                >
                  Save and Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800 font-poppins">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">
                      Online Registration Number
                    </span>
                  </label>
                  <input
                    type="text"
                    name="onlineRegistrationNumber"
                    value={formData.onlineRegistrationNumber}
                    onChange={handleInputChange}
                    placeholder="OID1025898272"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">
                      Date of Birth
                    </span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">
                      Mobile Number
                    </span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your mobile number"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={prevStep}
                  className="btn btn-outline btn-purple"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  className="btn btn-primary btn-purple"
                >
                  Save and Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800 font-poppins">
                Do you have any previous passports?
              </h2>
              <div className="form-control space-y-4">
                <label className="label cursor-pointer flex items-center gap-3">
                  <input
                    type="radio"
                    name="previousPassport"
                    value="Yes-MRP"
                    checked={formData.previousPassport === "Yes-MRP"}
                    onChange={handleInputChange}
                    className="radio radio-primary w-5 h-5"
                  />
                  <span className="label-text text-gray-700 font-poppins">
                    Yes, I have a Machine Readable Passport (MRP)
                  </span>
                </label>
                <label className="label cursor-pointer flex items-center gap-3">
                  <input
                    type="radio"
                    name="previousPassport"
                    value="Yes-ePP"
                    checked={formData.previousPassport === "Yes-ePP"}
                    onChange={handleInputChange}
                    className="radio radio-primary w-5 h-5"
                  />
                  <span className="label-text text-gray-700 font-poppins">
                    Yes, I have an Electronic Passport (ePP)
                  </span>
                </label>
                <label className="label cursor-pointer flex items-center gap-3">
                  <input
                    type="radio"
                    name="previousPassport"
                    value="No"
                    checked={formData.previousPassport === "No"}
                    onChange={handleInputChange}
                    className="radio radio-primary w-5 h-5"
                  />
                  <span className="label-text text-gray-700 font-poppins">
                    No, I don't have any previous passport / handwritten
                    passport
                  </span>
                </label>
              </div>
              {formData.previousPassport.startsWith("Yes") && (
                <div className="mt-6 md:flex gap-2 space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-poppins">
                        What is the reason for your passport request?
                      </span>
                    </label>
                    <select
                      name="reissueReason"
                      value={formData.reissueReason}
                      onChange={handleInputChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Select reissue reason</option>
                      <option value="Conversion to ePassport">
                        Conversion to ePassport
                      </option>
                      <option value="Expired">Expired</option>
                      <option value="Lost/Stolen">Lost/Stolen</option>
                      <option value="Data Change">Data Change</option>
                      <option value="Unusable">Unusable</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {formData.reissueReason === "Other" && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-poppins">
                          Please explain
                        </span>
                      </label>
                      <textarea
                        name="otherReason"
                        value={formData.otherReason}
                        onChange={handleInputChange}
                        placeholder="Explain your reason"
                        className="textarea textarea-bordered"
                        required
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-poppins">
                          Previous Passport Number
                        </span>
                      </label>
                      <input
                        type="text"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleInputChange}
                        placeholder="Enter passport number"
                        className="input input-bordered"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-poppins">
                          Date of Issue
                        </span>
                      </label>
                      <input
                        type="date"
                        name="issueDate"
                        value={formData.issueDate}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-poppins">
                          Date of Expiration
                        </span>
                      </label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className="btn btn-outline btn-purple"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  className="btn btn-primary btn-purple"
                >
                  Save and Continue
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800 font-poppins">
                Passport Options
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">
                      Passport Pages
                    </span>
                  </label>
                  <select
                    name="passportPages"
                    value={formData.passportPages}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="48">48 pages</option>
                    <option value="64">64 pages</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">Validity</span>
                  </label>
                  <select
                    name="validity"
                    value={formData.validity}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="5">5 years</option>
                    <option value="10">10 years</option>
                  </select>
                </div>
              </div>
              <p className="text-gray-700 font-poppins">
                <strong>Passport Price:</strong> {calculateBasePrice()} BDT
              </p>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className="btn btn-outline btn-purple"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  className="btn btn-primary btn-purple"
                >
                  Save and Continue
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-3xl font-bold mb-4 text-purple-600 font-poppins">
                Document Upload
              </h2>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">
                      Passport Application Copy *
                    </span>
                  </label>
                  <input
                    type="file"
                    name="applicationCopy"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                  {files.applicationCopy && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleViewFile(fileUrls.applicationCopy)}
                        className="btn btn-sm btn-outline btn-purple"
                        disabled={!fileUrls.applicationCopy}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteFile("applicationCopy")}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">
                      NID/Birth Certificate *
                    </span>
                  </label>
                  <input
                    type="file"
                    name="nidBirthCertificate"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                  {files.nidBirthCertificate && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() =>
                          handleViewFile(fileUrls.nidBirthCertificate)
                        }
                        className="btn btn-sm btn-outline btn-purple"
                        disabled={!fileUrls.nidBirthCertificate}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteFile("nidBirthCertificate")}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">
                      NID Online Copy *
                    </span>
                  </label>
                  <input
                    type="file"
                    name="nidOnlineCopy"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                  {files.nidOnlineCopy && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleViewFile(fileUrls.nidOnlineCopy)}
                        className="btn btn-sm btn-outline btn-purple"
                        disabled={!fileUrls.nidOnlineCopy}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteFile("nidOnlineCopy")}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">
                      Father NID/Birth Certificate *
                    </span>
                  </label>
                  <input
                    type="file"
                    name="fatherNidBirthCertificate"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                  {files.fatherNidBirthCertificate && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() =>
                          handleViewFile(fileUrls.fatherNidBirthCertificate)
                        }
                        className="btn btn-sm btn-outline btn-purple"
                        disabled={!fileUrls.fatherNidBirthCertificate}
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteFile("fatherNidBirthCertificate")
                        }
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">
                      Mother NID/Birth Certificate *
                    </span>
                  </label>
                  <input
                    type="file"
                    name="motherNidBirthCertificate"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                  {files.motherNidBirthCertificate && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() =>
                          handleViewFile(fileUrls.motherNidBirthCertificate)
                        }
                        className="btn btn-sm btn-outline btn-purple"
                        disabled={!fileUrls.motherNidBirthCertificate}
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteFile("motherNidBirthCertificate")
                        }
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">
                      Utility Bill Copy *
                    </span>
                  </label>
                  <input
                    type="file"
                    name="utilityBillCopy"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                  {files.utilityBillCopy && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleViewFile(fileUrls.utilityBillCopy)}
                        className="btn btn-sm btn-outline btn-purple"
                        disabled={!fileUrls.utilityBillCopy}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteFile("utilityBillCopy")}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">
                      Land Register *
                    </span>
                  </label>
                  <input
                    type="file"
                    name="landRegister"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                  {files.landRegister && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleViewFile(fileUrls.landRegister)}
                        className="btn btn-sm btn-outline btn-purple"
                        disabled={!fileUrls.landRegister}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteFile("landRegister")}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">
                      Citizenship Certificate *
                    </span>
                  </label>
                  <input
                    type="file"
                    name="citizenshipCertificate"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                  {files.citizenshipCertificate && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() =>
                          handleViewFile(fileUrls.citizenshipCertificate)
                        }
                        className="btn btn-sm btn-outline btn-purple"
                        disabled={!fileUrls.citizenshipCertificate}
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteFile("citizenshipCertificate")
                        }
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">
                      Student/Job Card (if applicable)
                    </span>
                  </label>
                  <input
                    type="file"
                    name="studentJobCard"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                  />
                  {files.studentJobCard && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleViewFile(fileUrls.studentJobCard)}
                        className="btn btn-sm btn-outline btn-purple"
                        disabled={!fileUrls.studentJobCard}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteFile("studentJobCard")}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">
                      Previous Passport (if applicable)
                    </span>
                  </label>
                  <input
                    type="file"
                    name="previousPassport"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                  />
                  {files.previousPassport && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() =>
                          handleViewFile(fileUrls.previousPassport)
                        }
                        className="btn btn-sm btn-outline btn-purple"
                        disabled={!fileUrls.previousPassport}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteFile("previousPassport")}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">
                      Online GD (if applicable)
                    </span>
                  </label>
                  <input
                    type="file"
                    name="onlineGD"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                  />
                  {files.onlineGD && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleViewFile(fileUrls.onlineGD)}
                        className="btn btn-sm btn-outline btn-purple"
                        disabled={!fileUrls.onlineGD}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteFile("onlineGD")}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className="btn btn-outline btn-purple"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  className="btn btn-primary btn-purple"
                >
                  Save and Continue
                </button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800 font-poppins">
                Delivery Options & Appointment
              </h2>
              <p className="text-gray-600 mb-4 font-poppins">
                In this passport office, you can apply for a passport without
                scheduling an appointment. However, for Bangladesh Mission (if
                applicable), you are requested to coordinate with the Embassy to
                schedule your appointment.
              </p>
              <div className="form-control space-y-4 mb-6">
                <label className="label cursor-pointer flex items-center gap-3">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="Regular"
                    checked={formData.deliveryType === "Regular"}
                    onChange={handleInputChange}
                    className="radio radio-primary w-5 h-5"
                  />
                  <span className="label-text text-gray-700 font-poppins">
                    Regular delivery
                  </span>
                </label>
                <label className="label cursor-pointer flex items-center gap-3">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="Express"
                    checked={formData.deliveryType === "Express"}
                    onChange={handleInputChange}
                    className="radio radio-primary w-5 h-5"
                  />
                  <span className="label-text text-gray-700 font-poppins">
                    Express delivery
                  </span>
                </label>
              </div>
              {formData.deliveryType && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-purple-600 font-poppins">
                    Appointment Date & Time
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-poppins">
                          Select Date
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="appointmentDate"
                          value={
                            formData.appointmentDate
                              ? new Date(formData.appointmentDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={handleInputChange}
                          min="2025-04-28"
                          className="input input-bordered w-full pl-10"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a855f7' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "left 0.75rem center",
                            backgroundSize: "1.25rem",
                          }}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-poppins">
                          Select Time
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          name="appointmentTime"
                          value={formData.appointmentTime}
                          onChange={handleInputChange}
                          step="1800"
                          className="input input-bordered w-full pl-10"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a855f7' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "left 0.75rem center",
                            backgroundSize: "1.25rem",
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 font-poppins">
                    Unavailable times: 5:00 PM, 5:30 PM, 6:30 PM, 7:30 PM
                  </p>
                </div>
              )}
              <p className="text-gray-700 font-poppins">
                <strong>Passport Price:</strong> {calculateDeliveryPrice()} BDT{" "}
                <span className="text-sm text-gray-500">* VAT included</span>
              </p>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className="btn btn-outline btn-purple"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  className="btn btn-primary btn-purple"
                >
                  Save and Continue
                </button>
              </div>
            </div>
          )}

          {step === 7 && (
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800 font-poppins">
                Pickup Point
              </h2>
              <div className="form-control space-y-4 mb-6">
                <label className="label cursor-pointer flex items-center gap-3">
                  <input
                    type="radio"
                    name="pickupPoint"
                    value="Passport Office"
                    checked={formData.pickupPoint === "Passport Office"}
                    onChange={handleInputChange}
                    className="radio radio-primary w-5 h-5"
                  />
                  <span className="label-text text-gray-700 font-poppins">
                    Passport Office
                  </span>
                </label>
                <label className="label cursor-pointer flex items-center gap-3">
                  <input
                    type="radio"
                    name="pickupPoint"
                    value="ShaplaOSS Point"
                    checked={formData.pickupPoint === "ShaplaOSS Point"}
                    onChange={handleInputChange}
                    className="radio radio-primary w-5 h-5"
                  />
                  <span className="label-text text-gray-700 font-poppins">
                    ShaplaOSS Point
                  </span>
                </label>
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className="btn btn-outline btn-purple"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  className="btn btn-primary btn-purple"
                >
                  Save and Continue
                </button>
              </div>
            </div>
          )}

          {step === 8 && (
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800 font-poppins">
                Review & Submit
              </h2>
              <div className="mb-6 space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Passport Type
                  </h3>
                  <p className="text-gray-700 font-poppins">
                    {formData.passportType}
                  </p>
                </div>
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Personal Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700 font-poppins">
                      <strong>Online Registration Number:</strong>{" "}
                      {formData.onlineRegistrationNumber}
                    </p>
                    <p className="text-gray-700 font-poppins">
                      <strong>Full Name:</strong> {formData.fullName}
                    </p>
                    <p className="text-gray-700 font-poppins">
                      <strong>Date of Birth:</strong> {formData.dateOfBirth}
                    </p>
                    <p className="text-gray-700 font-poppins">
                      <strong>Mobile Number:</strong> {formData.mobileNumber}
                    </p>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Previous Passport
                  </h3>
                  <p className="text-gray-700 font-poppins">
                    <strong>Has Previous Passport:</strong>{" "}
                    {formData.previousPassport === "Yes-MRP"
                      ? "Yes, I have a Machine Readable Passport (MRP)"
                      : formData.previousPassport === "Yes-ePP"
                      ? "Yes, I have an Electronic Passport (ePP)"
                      : "No, I don't have any previous passport / handwritten passport"}
                  </p>
                  {formData.previousPassport.startsWith("Yes") && (
                    <>
                      <p className="text-gray-700 font-poppins">
                        <strong>Reissue Reason:</strong>{" "}
                        {formData.reissueReason}
                      </p>
                      {formData.reissueReason === "Other" && (
                        <p className="text-gray-700 font-poppins">
                          <strong>Explanation:</strong> {formData.otherReason}
                        </p>
                      )}
                      <p className="text-gray-700 font-poppins">
                        <strong>Passport Number:</strong>{" "}
                        {formData.passportNumber}
                      </p>
                      <p className="text-gray-700 font-poppins">
                        <strong>Issue Date:</strong> {formData.issueDate}
                      </p>
                      <p className="text-gray-700 font-poppins">
                        <strong>Expiry Date:</strong> {formData.expiryDate}
                      </p>
                    </>
                  )}
                </div>
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Passport Options
                  </h3>
                  <p className="text-gray-700 font-poppins">
                    <strong>Passport Pages:</strong> {formData.passportPages}{" "}
                    pages
                  </p>
                  <p className="text-gray-700 font-poppins">
                    <strong>Validity:</strong> {formData.validity} years
                  </p>
                </div>
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Documents
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700 font-poppins flex items-center justify-between">
                      <span>
                        <strong>Application Copy:</strong>{" "}
                        {fileUrls.applicationCopy ? "Uploaded" : "Not uploaded"}
                      </span>
                      {fileUrls.applicationCopy && (
                        <button
                          onClick={() =>
                            handleViewFile(fileUrls.applicationCopy)
                          }
                          className="btn btn-sm btn-outline btn-purple"
                        >
                          View
                        </button>
                      )}
                    </p>
                    <p className="text-gray-700 font-poppins flex items-center justify-between">
                      <span>
                        <strong>NID/Birth Certificate:</strong>{" "}
                        {fileUrls.nidBirthCertificate
                          ? "Uploaded"
                          : "Not uploaded"}
                      </span>
                      {fileUrls.nidBirthCertificate && (
                        <button
                          onClick={() =>
                            handleViewFile(fileUrls.nidBirthCertificate)
                          }
                          className="btn btn-sm btn-outline btn-purple"
                        >
                          View
                        </button>
                      )}
                    </p>
                    <p className="text-gray-700 font-poppins flex items-center justify-between">
                      <span>
                        <strong>NID Online Copy:</strong>{" "}
                        {fileUrls.nidOnlineCopy ? "Uploaded" : "Not uploaded"}
                      </span>
                      {fileUrls.nidOnlineCopy && (
                        <button
                          onClick={() => handleViewFile(fileUrls.nidOnlineCopy)}
                          className="btn btn-sm btn-outline btn-purple"
                        >
                          View
                        </button>
                      )}
                    </p>
                    <p className="text-gray-700 font-poppins flex items-center justify-between">
                      <span>
                        <strong>Student/Job Card:</strong>{" "}
                        {fileUrls.studentJobCard ? "Uploaded" : "Not uploaded"}
                      </span>
                      {fileUrls.studentJobCard && (
                        <button
                          onClick={() =>
                            handleViewFile(fileUrls.studentJobCard)
                          }
                          className="btn btn-sm btn-outline btn-purple"
                        >
                          View
                        </button>
                      )}
                    </p>
                    <p className="text-gray-700 font-poppins flex items-center justify-between">
                      <span>
                        <strong>Father NID/Birth Certificate:</strong>{" "}
                        {fileUrls.fatherNidBirthCertificate
                          ? "Uploaded"
                          : "Not uploaded"}
                      </span>
                      {fileUrls.fatherNidBirthCertificate && (
                        <button
                          onClick={() =>
                            handleViewFile(fileUrls.fatherNidBirthCertificate)
                          }
                          className="btn btn-sm btn-outline btn-purple"
                        >
                          View
                        </button>
                      )}
                    </p>
                    <p className="text-gray-700 font-poppins flex items-center justify-between">
                      <span>
                        <strong>Mother NID/Birth Certificate:</strong>{" "}
                        {fileUrls.motherNidBirthCertificate
                          ? "Uploaded"
                          : "Not uploaded"}
                      </span>
                      {fileUrls.motherNidBirthCertificate && (
                        <button
                          onClick={() =>
                            handleViewFile(fileUrls.motherNidBirthCertificate)
                          }
                          className="btn btn-sm btn-outline btn-purple"
                        >
                          View
                        </button>
                      )}
                    </p>
                    <p className="text-gray-700 font-poppins flex items-center justify-between">
                      <span>
                        <strong>Utility Bill Copy:</strong>{" "}
                        {fileUrls.utilityBillCopy ? "Uploaded" : "Not uploaded"}
                      </span>
                      {fileUrls.utilityBillCopy && (
                        <button
                          onClick={() =>
                            handleViewFile(fileUrls.utilityBillCopy)
                          }
                          className="btn btn-sm btn-outline btn-purple"
                        >
                          View
                        </button>
                      )}
                    </p>
                    <p className="text-gray-700 font-poppins flex items-center justify-between">
                      <span>
                        <strong>Previous Passport:</strong>{" "}
                        {fileUrls.previousPassport
                          ? "Uploaded"
                          : "Not uploaded"}
                      </span>
                      {fileUrls.previousPassport && (
                        <button
                          onClick={() =>
                            handleViewFile(fileUrls.previousPassport)
                          }
                          className="btn btn-sm btn-outline btn-purple"
                        >
                          View
                        </button>
                      )}
                    </p>
                    <p className="text-gray-700 font-poppins flex items-center justify-between">
                      <span>
                        <strong>Land Register:</strong>{" "}
                        {fileUrls.landRegister ? "Uploaded" : "Not uploaded"}
                      </span>
                      {fileUrls.landRegister && (
                        <button
                          onClick={() => handleViewFile(fileUrls.landRegister)}
                          className="btn btn-sm btn-outline btn-purple"
                        >
                          View
                        </button>
                      )}
                    </p>
                    <p className="text-gray-700 font-poppins flex items-center justify-between">
                      <span>
                        <strong>Citizenship Certificate:</strong>{" "}
                        {fileUrls.citizenshipCertificate
                          ? "Uploaded"
                          : "Not uploaded"}
                      </span>
                      {fileUrls.citizenshipCertificate && (
                        <button
                          onClick={() =>
                            handleViewFile(fileUrls.citizenshipCertificate)
                          }
                          className="btn btn-sm btn-outline btn-purple"
                        >
                          View
                        </button>
                      )}
                    </p>
                    <p className="text-gray-700 font-poppins flex items-center justify-between">
                      <span>
                        <strong>Online GD:</strong>{" "}
                        {fileUrls.onlineGD ? "Uploaded" : "Not uploaded"}
                      </span>
                      {fileUrls.onlineGD && (
                        <button
                          onClick={() => handleViewFile(fileUrls.onlineGD)}
                          className="btn btn-sm btn-outline btn-purple"
                        >
                          View
                        </button>
                      )}
                    </p>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Delivery Options
                  </h3>
                  <p className="text-gray-700 font-poppins">
                    <strong>Delivery Type:</strong> {formData.deliveryType}
                  </p>
                  <p className="text-gray-700 font-poppins">
                    <strong>Appointment Date & Time:</strong>{" "}
                    {new Date(formData.appointmentDate).toLocaleString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }
                    )}
                  </p>
                </div>
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Pickup Point
                  </h3>
                  <p className="text-gray-700 font-poppins">
                    {formData.pickupPoint}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-600 font-poppins">
                    Total Price
                  </h3>
                  <p className="text-gray-700 font-poppins">
                    {calculateDeliveryPrice()} BDT
                  </p>
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className="btn btn-outline btn-purple"
                >
                  Previous
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary btn-purple"
                >
                  Submit Application
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassportApplicationForm;
