import React, { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const PassportApplicationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    passportType: "",
    fullName: "",
    dateOfBirth: "",
    previousPassport: "",
    passportNumber: "",
    issueDate: "",
    expiryDate: "",
    passportPages: "48",
    validity: "5",
    deliveryType: "Regular",
    exclusiveService: "No",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    setFiles({ ...files, [name]: uploadedFiles[0] });
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.passportType) {
        toast.error("Please select a passport type!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      if (formData.passportType !== "Ordinary") {
        toast.info("Please communicate with your authority to proceed.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }
    if (step === 2 && (!formData.fullName || !formData.dateOfBirth)) {
      toast.error("Please fill in all personal information fields!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (step === 3 && !formData.previousPassport) {
      toast.error("Please select an option for previous passport!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (step === 3 && formData.previousPassport.startsWith("Yes") && (!formData.passportNumber || !formData.issueDate || !formData.expiryDate)) {
      toast.error("Please fill in all previous passport details!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (step === 4 && (!formData.passportPages || !formData.validity)) {
      toast.error("Please select passport options!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (step === 5 && (!files.applicationCopy || !files.nidBirthCertificate || !files.nidOnlineCopy || !files.studentJobCard || !files.fatherNidBirthCertificate || !files.motherNidBirthCertificate || !files.utilityBillCopy || !files.landRegister || !files.citizenshipCertificate)) {
      toast.error("Please upload all required documents!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (step === 6 && !formData.deliveryType) {
      toast.error("Please select a delivery type!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (step === 7 && !formData.exclusiveService) {
      toast.error("Please select an option for exclusive service!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.passportType ||
      !formData.fullName ||
      !formData.dateOfBirth ||
      !formData.previousPassport ||
      !formData.passportPages ||
      !formData.validity ||
      !formData.deliveryType ||
      !formData.exclusiveService ||
      !files.applicationCopy ||
      !files.nidBirthCertificate ||
      !files.nidOnlineCopy ||
      !files.studentJobCard ||
      !files.fatherNidBirthCertificate ||
      !files.motherNidBirthCertificate ||
      !files.utilityBillCopy ||
      !files.landRegister ||
      !files.citizenshipCertificate
    ) {
      toast.error("Please complete all steps and upload all required documents!", {
        position: "top-right",
        autoClose: 3000,
      });
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
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Application submitted successfully! Application ID: PAS-2025-98765", {
          position: "top-right",
          autoClose: 3000,
        });
        setStep(1);
        setFormData({
          passportType: "",
          fullName: "",
          dateOfBirth: "",
          previousPassport: "",
          passportNumber: "",
          issueDate: "",
          expiryDate: "",
          passportPages: "48",
          validity: "5",
          deliveryType: "Regular",
          exclusiveService: "No",
        });
        setFiles({
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

  const calculateFinalPrice = () => {
    if (formData.exclusiveService === "Yes") {
      if (formData.deliveryType === "Express") {
        return 8625;
      }
      return 8000;
    }
    return calculateDeliveryPrice();
  };

  return (
    <div className="container mx-auto p-4 pt-16">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-600 font-poppins">
        Passport Application Form
      </h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-center mb-6">
            <div className="steps">
              <div className={`step ${step >= 1 ? "step-primary" : ""}`}>Passport Type</div>
              <div className={`step ${step >= 2 ? "step-primary" : ""}`}>Personal Information</div>
              <div className={`step ${step >= 3 ? "step-primary" : ""}`}>Previous Passport</div>
              <div className={`step ${step >= 4 ? "step-primary" : ""}`}>Passport Options</div>
              <div className={`step ${step >= 5 ? "step-primary" : ""}`}>Documents</div>
              <div className={`step ${step >= 6 ? "step-primary" : ""}`}>Delivery Options</div>
              <div className={`step ${step >= 7 ? "step-primary" : ""}`}>Exclusive Service</div>
              <div className={`step ${step >= 8 ? "step-primary" : ""}`}>Review & Submit</div>
            </div>
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800 font-poppins">
                Passport Type
              </h2>
              <p className="text-gray-600 mb-6 font-poppins">
                Select the Passport Type for your application!
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
                  <span className="label-text text-gray-700 font-poppins">Ordinary Passport</span>
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
                  <span className="label-text text-gray-700 font-poppins">Official Passport</span>
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
                  <span className="label-text text-gray-700 font-poppins">Diplomatic Passport</span>
                </label>
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={nextStep} className="btn btn-primary btn-purple">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">Date of Birth</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={prevStep} className="btn btn-outline btn-purple">
                  Previous
                </button>
                <button onClick={nextStep} className="btn btn-primary btn-purple">
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
                    No, I don't have any previous passport / handwritten passport
                  </span>
                </label>
              </div>
              {formData.previousPassport.startsWith("Yes") && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-poppins">Passport Number</span>
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
                      <span className="label-text font-poppins">Issue Date</span>
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
                      <span className="label-text font-poppins">Expiry Date</span>
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
              )}
              <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="btn btn-outline btn-purple">
                  Previous
                </button>
                <button onClick={nextStep} className="btn btn-primary btn-purple">
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
                    <span className="label-text font-poppins">Passport Pages</span>
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
                <button onClick={prevStep} className="btn btn-outline btn-purple">
                  Previous
                </button>
                <button onClick={nextStep} className="btn btn-primary btn-purple">
                  Save and Continue
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800 font-poppins">
                Document Upload
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">Application Copy</span>
                  </label>
                  <input
                    type="file"
                    name="applicationCopy"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">NID/Birth Certificate</span>
                  </label>
                  <input
                    type="file"
                    name="nidBirthCertificate"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">NID Online Copy</span>
                  </label>
                  <input
                    type="file"
                    name="nidOnlineCopy"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">Student/Job Card</span>
                  </label>
                  <input
                    type="file"
                    name="studentJobCard"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">Father NID/Birth Certificate</span>
                  </label>
                  <input
                    type="file"
                    name="fatherNidBirthCertificate"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">Mother NID/Birth Certificate</span>
                  </label>
                  <input
                    type="file"
                    name="motherNidBirthCertificate"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">Utility Bill Copy</span>
                  </label>
                  <input
                    type="file"
                    name="utilityBillCopy"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">Previous Passport (if available)</span>
                  </label>
                  <input
                    type="file"
                    name="previousPassport"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">Land Register</span>
                  </label>
                  <input
                    type="file"
                    name="landRegister"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">Citizenship Certificate</span>
                  </label>
                  <input
                    type="file"
                    name="citizenshipCertificate"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-poppins">Online GD (if available)</span>
                  </label>
                  <input
                    type="file"
                    name="onlineGD"
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.pdf"
                    className="file-input file-input-bordered w-full"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="btn btn-outline btn-purple">
                  Previous
                </button>
                <button onClick={nextStep} className="btn btn-primary btn-purple">
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
                In this passport office, you can apply for a passport without scheduling an appointment. However, for Bangladesh Mission (if applicable), you are requested to coordinate with the Embassy to schedule your appointment.
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
                  <span className="label-text text-gray-700 font-poppins">Regular delivery</span>
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
                  <span className="label-text text-gray-700 font-poppins">Express delivery</span>
                </label>
              </div>
              <p className="text-gray-700 font-poppins">
                <strong>Passport Price:</strong> {calculateDeliveryPrice()} BDT <span className="text-sm text-gray-500">* VAT included</span>
              </p>
              <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="btn btn-outline btn-purple">
                  Previous
                </button>
                <button onClick={nextStep} className="btn btn-primary btn-purple">
                  Save and Continue
                </button>
              </div>
            </div>
          )}

          {step === 7 && (
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800 font-poppins">
                Exclusive Service
              </h2>
              <div className="form-control space-y-4 mb-6">
                <label className="label cursor-pointer flex items-center gap-3">
                  <input
                    type="radio"
                    name="exclusiveService"
                    value="Yes"
                    checked={formData.exclusiveService === "Yes"}
                    onChange={handleInputChange}
                    className="radio radio-primary w-5 h-5"
                  />
                  <span className="label-text text-gray-700 font-poppins">Yes</span>
                </label>
                <label className="label cursor-pointer flex items-center gap-3">
                  <input
                    type="radio"
                    name="exclusiveService"
                    value="No"
                    checked={formData.exclusiveService === "No"}
                    onChange={handleInputChange}
                    className="radio radio-primary w-5 h-5"
                  />
                  <span className="label-text text-gray-700 font-poppins">No</span>
                </label>
              </div>
              {formData.exclusiveService === "Yes" && (
                <div className="mb-6">
                  <p className="text-gray-700 font-poppins">
                    <strong>Regular Delivery (15 days):</strong> 8000 BDT <span className="text-sm text-gray-500">* VAT included</span>
                  </p>
                  <p className="text-gray-700 font-poppins">
                    <strong>Express Delivery (10 days):</strong> 8625 BDT <span className="text-sm text-gray-500">* VAT included</span>
                  </p>
                </div>
              )}
              <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="btn btn-outline btn-purple">
                  Previous
                </button>
                <button onClick={nextStep} className="btn btn-primary btn-purple">
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
              <div className="mb-6 space-y-2">
                <p className="font-poppins"><strong>Passport Type:</strong> {formData.passportType}</p>
                <p className="font-poppins"><strong>Full Name:</strong> {formData.fullName}</p>
                <p className="font-poppins"><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
                <p className="font-poppins"><strong>Previous Passport:</strong> {formData.previousPassport === "Yes-MRP" ? "Yes, I have a Machine Readable Passport (MRP)" : formData.previousPassport === "Yes-ePP" ? "Yes, I have an Electronic Passport (ePP)" : "No, I don't have any previous passport / handwritten passport"}</p>
                {formData.previousPassport.startsWith("Yes") && (
                  <>
                    <p className="font-poppins"><strong>Passport Number:</strong> {formData.passportNumber}</p>
                    <p className="font-poppins"><strong>Issue Date:</strong> {formData.issueDate}</p>
                    <p className="font-poppins"><strong>Expiry Date:</strong> {formData.expiryDate}</p>
                  </>
                )}
                <p className="font-poppins"><strong>Passport Pages:</strong> {formData.passportPages} pages</p>
                <p className="font-poppins"><strong>Validity:</strong> {formData.validity} years</p>
                <p className="font-poppins"><strong>Delivery Type:</strong> {formData.deliveryType}</p>
                <p className="font-poppins"><strong>Exclusive Service:</strong> {formData.exclusiveService}</p>
                <p className="font-poppins"><strong>Total Price:</strong> {calculateFinalPrice()} BDT</p>
                <p className="font-poppins"><strong>Application Copy:</strong> {files.applicationCopy ? files.applicationCopy.name : "Not uploaded"}</p>
                <p className="font-poppins"><strong>NID/Birth Certificate:</strong> {files.nidBirthCertificate ? files.nidBirthCertificate.name : "Not uploaded"}</p>
                <p className="font-poppins"><strong>NID Online Copy:</strong> {files.nidOnlineCopy ? files.nidOnlineCopy.name : "Not uploaded"}</p>
                <p className="font-poppins"><strong>Student/Job Card:</strong> {files.studentJobCard ? files.studentJobCard.name : "Not uploaded"}</p>
                <p className="font-poppins"><strong>Father NID/Birth Certificate:</strong> {files.fatherNidBirthCertificate ? files.fatherNidBirthCertificate.name : "Not uploaded"}</p>
                <p className="font-poppins"><strong>Mother NID/Birth Certificate:</strong> {files.motherNidBirthCertificate ? files.motherNidBirthCertificate.name : "Not uploaded"}</p>
                <p className="font-poppins"><strong>Utility Bill Copy:</strong> {files.utilityBillCopy ? files.utilityBillCopy.name : "Not uploaded"}</p>
                <p className="font-poppins"><strong>Previous Passport:</strong> {files.previousPassport ? files.previousPassport.name : "Not uploaded"}</p>
                <p className="font-poppins"><strong>Land Register:</strong> {files.landRegister ? files.landRegister.name : "Not uploaded"}</p>
                <p className="font-poppins"><strong>Citizenship Certificate:</strong> {files.citizenshipCertificate ? files.citizenshipCertificate.name : "Not uploaded"}</p>
                <p className="font-poppins"><strong>Online GD:</strong> {files.onlineGD ? files.onlineGD.name : "Not uploaded"}</p>
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="btn btn-outline btn-purple">
                  Previous
                </button>
                <button onClick={handleSubmit} className="btn btn-primary btn-purple">
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