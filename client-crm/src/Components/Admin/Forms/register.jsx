import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import React, { useState, lazy, Suspense, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { useTheme } from "../../../hooks/use-theme";

const EyeIcon = lazy(() => import("lucide-react").then((module) => ({ default: module.Eye })));
const EyeSlashIcon = lazy(() => import("lucide-react").then((module) => ({ default: module.EyeOff })));
const UploadIcon = lazy(() => import("lucide-react").then((module) => ({ default: module.Upload })));
const XIcon = lazy(() => import("lucide-react").then((module) => ({ default: module.X })));

const RecruiterRegister = () => {
  const [step, setStep] = useState(1); // 1 = form, 2 = image upload, 3 = OTP verify
  const [otp, setOtp] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    companyName: "",
    email: "",
    countryCode: "+1",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Log step changes
  useEffect(() => {
    console.log("Current step:", step);
  }, [step]);

  const validateForm = () => {
    console.log("Validating form with data:", formData);
    
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d{7,15}$/.test(formData.phoneNumber.trim()))
      newErrors.phoneNumber = "Please enter a valid phone number (7-15 digits)";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms";

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateImage = () => {
    if (!selectedImage) {
      toast.error("Please select an image to upload");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    
    setFormData(newFormData);
    console.log("Form Data Updated:", { field: name, value: type === "checkbox" ? checked : value });

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected Image:", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString()
      });

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        console.log("Image preview created successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    console.log("Removing selected image");
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Step 1: Handle form submission and move to image upload
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted, validating...");
    if (!validateForm()) return;
    console.log("Form validation passed, moving to step 2");
    setStep(2); // Move to image upload step
  };

  // Step 2: Handle image upload and send OTP
  const handleImageUpload = async (e) => {
    e.preventDefault();
    // console.log("Image upload form submitted");
    if (!validateImage()) return;

    setIsSubmitting(true);
    console.log("Sending OTP request with data:", {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      companyName: formData.companyName,
      email: formData.email,
      phone: formData.countryCode + formData.phoneNumber,
    });

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/companyOTP/sendOTP`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          companyName: formData.companyName,
          email: formData.email,
          phone: formData.countryCode + formData.phoneNumber,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("OTP Send Response:", data);

      if (data.success) {
        toast.success("OTP sent! Please check your email.");
        setStep(3); // Move to OTP verification step
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("OTP Send Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Error sending OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Handle OTP verification and final registration
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    console.log("OTP form submitted with OTP:", otp);

    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    setIsSubmitting(true);

    try {
  // Create FormData for file upload
  const formDataToSend = new FormData();
  formDataToSend.append('firstName', formData.firstName);
  formDataToSend.append('lastName', formData.lastName);
  formDataToSend.append('username', formData.username);
  formDataToSend.append('companyName', formData.companyName);
  formDataToSend.append('email', formData.email);
  formDataToSend.append('phone', formData.countryCode + formData.phoneNumber);
  formDataToSend.append('password', formData.password);
  formDataToSend.append('agreeToTerms', formData.agreeToTerms);
  formDataToSend.append('otp', otp);
  
  // Append image if selected - using 'profilePhoto' to match backend
  if (selectedImage) {
    formDataToSend.append('profilePhoto', selectedImage); // Fixed field name
  }

  // Debugging: Uncomment to verify what's being sent
  console.log("FormData being sent:");
  for (let [key, value] of formDataToSend.entries()) {
    console.log(key, value);
  }

  const { data } = await axios.post(
    `${API_BASE_URL}/api/companyOTP/verifyOTP`,
    formDataToSend,
    {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      },
    }
  );

  console.log("OTP Verification Response:", data);

  if (data.success) {
    console.log("Registration successful, redirecting to dashboard");
    toast.success("Signup successful!");
    setTimeout(() => navigate("/dashboard"), 1500);
  } else {
    toast.error(data.message || "OTP verification or signup failed");
  }
} catch (error) {
  console.error("Registration error:", error);
  toast.error(error.response?.data?.message || "Registration failed");
} finally {
      setIsSubmitting(false);
    }
  };

  const goBackToStep = (targetStep) => {
    console.log("Going back to step:", targetStep);
    setStep(targetStep);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row h-[calc(100vh-2rem)] max-h-[90vh]">
        <div className="hidden lg:block lg:w-1/2 bg-gray-100 h-full">
          <LazyLoadImage
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
            alt="Business meeting"
            effect="blur"
            className="w-full h-full object-cover"
            width="100%"
            height="100%"
          />
        </div>

        <div className="w-full lg:w-1/2 p-8 md:p-12 overflow-y-auto">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Step {step} of 3
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#ff8633] h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {step === 1 && "Recruiter Sign Up"}
            {step === 2 && "Upload Profile Image"}
            {step === 3 && "Verify Your Account"}
          </h1>

          {/* Step 1: Form */}
          {step === 1 && (
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              {/* First Name and Last Name - Side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your first name"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.firstName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ff8633]"
                    }`}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your last name"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.lastName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ff8633]"
                    }`}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Choose a username"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.username ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ff8633]"
                  }`}
                />
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your company name"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.companyName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ff8633]"
                  }`}
                />
                {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ff8633]"
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="flex">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className={`mr-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.phoneNumber ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ff8633]"
                    }`}
                  >
                    <option value="+1">+1 (USA)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+91">+91 (India)</option>
                    <option value="+61">+61 (Australia)</option>
                    <option value="+81">+81 (Japan)</option>
                  </select>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number"
                    className={`flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.phoneNumber ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ff8633]"
                    }`}
                  />
                </div>
                {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ff8633]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  style={{ top: '24px' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Suspense fallback={<div className="w-5 h-5" />}>
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </Suspense>
                </button>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#ff8633]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  style={{ top: '24px' }}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <Suspense fallback={<div className="w-5 h-5" />}>
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </Suspense>
                </button>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              {/* Agree to Terms */}
              <div className="flex items-center mt-4">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
                  I agree to Privacy Policy and Terms
                </label>
              </div>
              {errors.agreeToTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-[#ff8633] text-white py-3 rounded-md font-semibold hover:bg-[#e47b17] transition-colors disabled:opacity-60"
              >
                Next: Upload Image
              </button>
            </form>
          )}

          {/* Step 2: Image Upload */}
          {step === 2 && (
            <form className="space-y-6" onSubmit={handleImageUpload}>
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Please upload a profile image to complete your registration
                </p>
              </div>

              <div className="space-y-4">
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#ff8633] transition-colors">
                    <Suspense fallback={<div className="w-12 h-12 mx-auto" />}>
                      <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    </Suspense>
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Click to upload or drag and drop
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PNG, JPG, JPEG up to 5MB
                        </span>
                      </label>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="border border-gray-300 rounded-lg p-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-md"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <Suspense fallback={<div className="w-5 h-5" />}>
                        <XIcon className="h-5 w-5" />
                      </Suspense>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => goBackToStep(1)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-400 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#ff8633] text-white py-3 rounded-md font-semibold hover:bg-[#e47b17] transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? "Sending OTP..." : "Next: Verify Account"}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: OTP Verification */}
          {step === 3 && (
            <form className="space-y-6" onSubmit={handleOtpSubmit}>
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  We've sent a 6-digit verification code to your email address
                </p>
                <p className="text-sm text-gray-500">
                  {formData.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter 6 Digit OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="Enter OTP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633] text-center text-2xl tracking-widest"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => goBackToStep(2)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-400 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#ff8633] text-white py-3 rounded-md font-semibold hover:bg-[#e47b17] transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? "Verifying..." : "Complete Registration"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterRegister;