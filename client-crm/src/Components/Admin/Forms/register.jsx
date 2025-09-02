// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import React, { useState, lazy, Suspense, useEffect } from "react";
// import { LazyLoadImage } from "react-lazy-load-image-component";
// import "react-lazy-load-image-component/src/effects/blur.css";
// import axios from "axios";
// import { API_BASE_URL } from "../../../config/api";
// import { useTheme } from "../../../hooks/use-theme";

// const EyeIcon = lazy(() => import("lucide-react").then((module) => ({ default: module.Eye })));
// const EyeSlashIcon = lazy(() => import("lucide-react").then((module) => ({ default: module.EyeOff })));
// const UploadIcon = lazy(() => import("lucide-react").then((module) => ({ default: module.Upload })));
// const XIcon = lazy(() => import("lucide-react").then((module) => ({ default: module.X })));

// const RecruiterRegister = () => {
//   const [step, setStep] = useState(1); // 1 = form, 2 = image upload, 3 = OTP verify
//   const [otp, setOtp] = useState("");
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     username: "",
//     companyName: "",
//     email: "",
//     countryCode: "+1",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//     agreeToTerms: false,
//   });

//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();
//   const { theme } = useTheme();

//   // Log step changes
//   useEffect(() => {
//     console.log("Current step:", step);
//   }, [step]);

//   const validateForm = () => {
//     console.log("Validating form with data:", formData);
    
//     const newErrors = {};
//     if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
//     if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
//     if (!formData.username.trim()) newErrors.username = "Username is required";
//     if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
//       newErrors.email = "Please enter a valid email address";
//     if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
//     else if (!/^\d{7,15}$/.test(formData.phoneNumber.trim()))
//       newErrors.phoneNumber = "Please enter a valid phone number (7-15 digits)";
//     if (!formData.password) newErrors.password = "Password is required";
//     else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
//     if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
//     else if (formData.password !== formData.confirmPassword)
//       newErrors.confirmPassword = "Passwords do not match";
//     if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms";

//     console.log("Validation errors:", newErrors);
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateImage = () => {
//     if (!selectedImage) {
//       toast.error("Please select an image to upload");
//       return false;
//     }
//     return true;
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const newFormData = {
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     };
    
//     setFormData(newFormData);
//     console.log("Form Data Updated:", { field: name, value: type === "checkbox" ? checked : value });

//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       console.log("Selected Image:", {
//         name: file.name,
//         size: file.size,
//         type: file.type,
//         lastModified: new Date(file.lastModified).toISOString()
//       });

//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         toast.error("Please select a valid image file");
//         return;
//       }
      
//       // Validate file size (5MB limit)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("Image size should be less than 5MB");
//         return;
//       }

//       setSelectedImage(file);
      
//       // Create preview
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImagePreview(e.target.result);
//         console.log("Image preview created successfully");
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const removeImage = () => {
//     console.log("Removing selected image");
//     setSelectedImage(null);
//     setImagePreview(null);
//   };

//   // Step 1: Handle form submission and move to image upload
//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form submitted, validating...");
//     if (!validateForm()) return;
//     console.log("Form validation passed, moving to step 2");
//     setStep(2); // Move to image upload step
//   };

//   // Step 2: Handle image upload and send OTP
//   const handleImageUpload = async (e) => {
//     e.preventDefault();
//     // console.log("Image upload form submitted");
//     if (!validateImage()) return;

//     setIsSubmitting(true);
//     console.log("Sending OTP request with data:", {
//       firstName: formData.firstName,
//       lastName: formData.lastName,
//       username: formData.username,
//       companyName: formData.companyName,
//       email: formData.email,
//       phone: formData.countryCode + formData.phoneNumber,
//     });

//     try {
//       const { data } = await axios.post(
//         `${API_BASE_URL}/api/companyOTP/sendOTP`,
//         {
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           username: formData.username,
//           companyName: formData.companyName,
//           email: formData.email,
//           phone: formData.countryCode + formData.phoneNumber,
//           password: formData.password,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       console.log("OTP Send Response:", data);

//       if (data.success) {
//         toast.success("OTP sent! Please check your email.");
//         setStep(3); // Move to OTP verification step
//       } else {
//         toast.error(data.message || "Failed to send OTP");
//       }
//     } catch (err) {
//       console.error("OTP Send Error:", err.response?.data || err.message);
//       toast.error(err.response?.data?.message || "Error sending OTP");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Step 3: Handle OTP verification and final registration
//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     console.log("OTP form submitted with OTP:", otp);

//     if (otp.length !== 6) {
//       toast.error("Please enter the 6-digit OTP");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//   // Create FormData for file upload
//   const formDataToSend = new FormData();
//   formDataToSend.append('firstName', formData.firstName);
//   formDataToSend.append('lastName', formData.lastName);
//   formDataToSend.append('username', formData.username);
//   formDataToSend.append('companyName', formData.companyName);
//   formDataToSend.append('email', formData.email);
//   formDataToSend.append('phone', formData.countryCode + formData.phoneNumber);
//   formDataToSend.append('password', formData.password);
//   formDataToSend.append('agreeToTerms', formData.agreeToTerms);
//   formDataToSend.append('otp', otp);
  
//   // Append image if selected - using 'profilePhoto' to match backend
//   if (selectedImage) {
//     formDataToSend.append('profilePhoto', selectedImage); // Fixed field name
//   }

//   // Debugging: Uncomment to verify what's being sent
//   console.log("FormData being sent:");
//   for (let [key, value] of formDataToSend.entries()) {
//     console.log(key, value);
//   }

//   const { data } = await axios.post(
//     `${API_BASE_URL}/api/companyOTP/verifyOTP`,
//     formDataToSend,
//     {
//       headers: { 
//         'Content-Type': 'multipart/form-data',
//         'Accept': 'application/json'
//       },
//     }
//   );

//   console.log("OTP Verification Response:", data);

//   if (data.success) {
//     console.log("Registration successful, redirecting to dashboard");
//     toast.success("Signup successful!");
//     setTimeout(() => navigate("/dashboard"), 1500);
//   } else {
//     toast.error(data.message || "OTP verification or signup failed");
//   }
// } catch (error) {
//   console.error("Registration error:", error);
//   toast.error(error.response?.data?.message || "Registration failed");
// } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const goBackToStep = (targetStep) => {
//     console.log("Going back to step:", targetStep);
//     setStep(targetStep);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row h-[calc(100vh-2rem)] max-h-[90vh]">
//         <div className="hidden lg:block lg:w-1/2 bg-gray-100 h-full">
//           <LazyLoadImage
//             src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
//             alt="Business meeting"
//             effect="blur"
//             className="w-full h-full object-cover"
//             width="100%"
//             height="100%"
//           />
//         </div>

//         <div className="w-full lg:w-1/2 p-8 md:p-12 overflow-y-auto">
//           {/* Progress Indicator */}
//           <div className="mb-6">
//             <div className="flex items-center justify-between mb-4">
//               <span className="text-sm font-medium text-gray-700">
//                 Step {step} of 3
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-[#ff8633] h-2 rounded-full transition-all duration-300" 
//                 style={{ width: `${(step / 3) * 100}%` }}
//               ></div>
//             </div>
//           </div>

//           <h1 className="text-2xl font-bold text-gray-800 mb-6">
//             {step === 1 && "Recruiter Sign Up"}
//             {step === 2 && "Upload Profile Image"}
//             {step === 3 && "Verify Your Account"}
//           </h1>

//           {/* Step 1: Form */}
//           {step === 1 && (
//             <form className="space-y-4" onSubmit={handleFormSubmit}>
//               {/* First Name and Last Name - Side by side */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     required
//                     placeholder="Enter your first name"
//                     className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//                       errors.firstName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ff8633]"
//                     }`}
//                   />
//                   {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     required
//                     placeholder="Enter your last name"
//                     className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//                       errors.lastName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ff8633]"
//                     }`}
//                   />
//                   {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
//                 </div>
//               </div>

//               {/* Username */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//                 <input
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   required
//                   placeholder="Choose a username"
//                   className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//                     errors.username ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ff8633]"
//                   }`}
//                 />
//                 {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
//               </div>

//               {/* Company Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
//                 <input
//                   type="text"
//                   name="companyName"
//                   value={formData.companyName}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter your company name"
//                   className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//                     errors.companyName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ff8633]"
//                   }`}
//                 />
//                 {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter your email"
//                   className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//                     errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ff8633]"
//                   }`}
//                 />
//                 {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
//               </div>

//               {/* Phone Number */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//                 <div className="flex">
//                   <select
//                     name="countryCode"
//                     value={formData.countryCode}
//                     onChange={handleChange}
//                     className={`mr-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//                       errors.phoneNumber ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ff8633]"
//                     }`}
//                   >
//                     <option value="+1">+1 (USA)</option>
//                     <option value="+44">+44 (UK)</option>
//                     <option value="+91">+91 (India)</option>
//                     <option value="+61">+61 (Australia)</option>
//                     <option value="+81">+81 (Japan)</option>
//                   </select>
//                   <input
//                     type="tel"
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleChange}
//                     required
//                     placeholder="Enter your phone number"
//                     className={`flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//                       errors.phoneNumber ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ff8633]"
//                     }`}
//                   />
//                 </div>
//                 {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
//               </div>

//               {/* Password */}
//               <div className="space-y-1 relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter your password"
//                   className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//                     errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ff8633]"
//                   }`}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                   style={{ top: '24px' }}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   <Suspense fallback={<div className="w-5 h-5" />}>
//                     {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
//                   </Suspense>
//                 </button>
//                 {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
//               </div>

//               {/* Confirm Password */}
//               <div className="space-y-1 relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   required
//                   placeholder="Confirm your password"
//                   className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//                     errors.confirmPassword
//                       ? "border-red-500 focus:ring-red-500"
//                       : "border-gray-300 focus:ring-[#ff8633]"
//                   }`}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                   style={{ top: '24px' }}
//                   aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                 >
//                   <Suspense fallback={<div className="w-5 h-5" />}>
//                     {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
//                   </Suspense>
//                 </button>
//                 {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
//               </div>

//               {/* Agree to Terms */}
//               <div className="flex items-center mt-4">
//                 <input
//                   id="agreeToTerms"
//                   name="agreeToTerms"
//                   type="checkbox"
//                   checked={formData.agreeToTerms}
//                   onChange={handleChange}
//                   className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                 />
//                 <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
//                   I agree to Privacy Policy and Terms
//                 </label>
//               </div>
//               {errors.agreeToTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>}

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full mt-6 bg-[#ff8633] text-white py-3 rounded-md font-semibold hover:bg-[#e47b17] transition-colors disabled:opacity-60"
//               >
//                 Next: Upload Image
//               </button>
//             </form>
//           )}

//           {/* Step 2: Image Upload */}
//           {step === 2 && (
//             <form className="space-y-6" onSubmit={handleImageUpload}>
//               <div className="text-center">
//                 <p className="text-gray-600 mb-4">
//                   Please upload a profile image to complete your registration
//                 </p>
//               </div>

//               <div className="space-y-4">
//                 {!imagePreview ? (
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#ff8633] transition-colors">
//                     <Suspense fallback={<div className="w-12 h-12 mx-auto" />}>
//                       <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
//                     </Suspense>
//                     <div className="mt-4">
//                       <label htmlFor="image-upload" className="cursor-pointer">
//                         <span className="mt-2 block text-sm font-medium text-gray-900">
//                           Click to upload or drag and drop
//                         </span>
//                         <span className="mt-1 block text-sm text-gray-500">
//                           PNG, JPG, JPEG up to 5MB
//                         </span>
//                       </label>
//                       <input
//                         id="image-upload"
//                         name="image-upload"
//                         type="file"
//                         className="sr-only"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                       />
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="relative">
//                     <div className="border border-gray-300 rounded-lg p-4">
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="w-full h-64 object-cover rounded-md"
//                       />
//                     </div>
//                     <button
//                       type="button"
//                       onClick={removeImage}
//                       className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                     >
//                       <Suspense fallback={<div className="w-5 h-5" />}>
//                         <XIcon className="h-5 w-5" />
//                       </Suspense>
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div className="flex space-x-4">
//                 <button
//                   type="button"
//                   onClick={() => goBackToStep(1)}
//                   className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-400 transition-colors"
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="flex-1 bg-[#ff8633] text-white py-3 rounded-md font-semibold hover:bg-[#e47b17] transition-colors disabled:opacity-60"
//                 >
//                   {isSubmitting ? "Sending OTP..." : "Next: Verify Account"}
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* Step 3: OTP Verification */}
//           {step === 3 && (
//             <form className="space-y-6" onSubmit={handleOtpSubmit}>
//               <div className="text-center">
//                 <p className="text-gray-600 mb-4">
//                   We've sent a 6-digit verification code to your email address
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {formData.email}
//                 </p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Enter 6 Digit OTP</label>
//                 <input
//                   type="text"
//                   maxLength={6}
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   required
//                   placeholder="Enter OTP"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633] text-center text-2xl tracking-widest"
//                 />
//               </div>

//               <div className="flex space-x-4">
//                 <button
//                   type="button"
//                   onClick={() => goBackToStep(2)}
//                   className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-400 transition-colors"
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="flex-1 bg-[#ff8633] text-white py-3 rounded-md font-semibold hover:bg-[#e47b17] transition-colors disabled:opacity-60"
//                 >
//                   {isSubmitting ? "Verifying..." : "Complete Registration"}
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecruiterRegister;


import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Upload, 
  X, 
  CheckCircle, 
  Clock,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const CompanyRegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationId, setRegistrationId] = useState('');

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    companyName: "",
    companyType: "",
    email: "",
    countryCode: "+1",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

  // Memoize arrays to prevent recreation on every render
  const companyTypes = useMemo(() => [
    { value: "", label: "Select Company Type" },
    { value: "technology", label: "Technology" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "retail", label: "Retail" },
    { value: "consulting", label: "Consulting" },
    { value: "real_estate", label: "Real Estate" },
    { value: "hospitality", label: "Hospitality" },
    { value: "nonprofit", label: "Non-Profit" },
    { value: "government", label: "Government" },
    { value: "startup", label: "Startup" },
    { value: "other", label: "Other" },
  ], []);

  const countryCodes = useMemo(() => [
    { value: "+1", label: "+1 (USA/Canada)" },
    { value: "+44", label: "+44 (UK)" },
    { value: "+91", label: "+91 (India)" },
    { value: "+61", label: "+61 (Australia)" },
    { value: "+81", label: "+81 (Japan)" },
    { value: "+49", label: "+49 (Germany)" },
    { value: "+33", label: "+33 (France)" },
    { value: "+86", label: "+86 (China)" },
  ], []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 3) newErrors.username = "Username must be at least 3 characters";
    
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.companyType) newErrors.companyType = "Company type is required";
    
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
    
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Use useCallback to prevent function recreation
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error if it exists
    setErrors(prev => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
  }, []);

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setStep(2);
  }, [validateForm]);

  const handleImageSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockRegId = 'REQ' + String(Date.now()).slice(-6);
      setRegistrationId(mockRegId);
      
      // ONLY LOG THE FINAL COMPLETE DATA HERE
      const finalRegistrationData = {
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username
        },
        companyInfo: {
          companyName: formData.companyName,
          companyType: formData.companyType
        },
        contactInfo: {
          email: formData.email,
          phone: {
            countryCode: formData.countryCode,
            phoneNumber: formData.phoneNumber
          }
        },
        accountInfo: {
          password: formData.password,
          agreeToTerms: formData.agreeToTerms
        },
        registrationMeta: {
          registrationId: mockRegId,
          submittedAt: new Date().toISOString(),
          hasProfileImage: selectedImage !== null,
          imageFileName: selectedImage?.name || null,
          imageFileSize: selectedImage?.size || null
        }
      };

      console.log(finalRegistrationData);
      
      setStep(3);
      
    } catch (error) {
      console.error('Registration failed');
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedImage]);

  const ProgressIndicator = useMemo(() => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Step {step} of 3
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {step === 1 ? 'Company Information' : step === 2 ? 'Profile Image' : 'Registration Complete'}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>
    </div>
  ), [step]);

  // Create stable input component to prevent re-creation
  const InputField = useCallback(({ 
    label, 
    name, 
    type = "text", 
    placeholder, 
    value, 
    error,
    required = false,
    ...props 
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && '*'}
      </label>
      <input
        key={`input-${name}`}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
          error 
            ? "border-red-500 focus:ring-red-500" 
            : "border-gray-300 dark:border-gray-600 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  ), [handleChange]);

  // Step 1: Registration Form
  const RegistrationFormStep = useMemo(() => (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <User className="w-5 h-5 mr-2 text-orange-500" />
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            error={errors.firstName}
            required
          />

          <InputField
            label="Last Name"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            error={errors.lastName}
            required
          />
        </div>

        <InputField
          label="Username"
          name="username"
          placeholder="Choose a unique username"
          value={formData.username}
          error={errors.username}
          required
        />
      </div>

      {/* Company Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Building className="w-5 h-5 mr-2 text-orange-500" />
          Company Information
        </h3>
        
        <InputField
          label="Company Name"
          name="companyName"
          placeholder="Enter your company name"
          value={formData.companyName}
          error={errors.companyName}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company Type *
          </label>
          <select
            key="companyType-select"
            name="companyType"
            value={formData.companyType}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
              errors.companyType 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300 dark:border-gray-600 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
            }`}
          >
            {companyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.companyType && (
            <p className="mt-1 text-sm text-red-600">{errors.companyType}</p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Mail className="w-5 h-5 mr-2 text-orange-500" />
          Contact Information
        </h3>
        
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your business email"
          value={formData.email}
          error={errors.email}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number *
          </label>
          <div className="flex space-x-2">
            <select
              key="countryCode-select"
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className="px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
            >
              {countryCodes.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
            <input
              key="phoneNumber-input"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                errors.phoneNumber 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-300 dark:border-gray-600 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
              }`}
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
          )}
        </div>
      </div>

      {/* Password Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Lock className="w-5 h-5 mr-2 text-orange-500" />
          Account Security
        </h3>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password *
          </label>
          <input
            key="password-input"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
              errors.password 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300 dark:border-gray-600 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirm Password *
          </label>
          <input
            key="confirmPassword-input"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
              errors.confirmPassword 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300 dark:border-gray-600 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="flex items-start space-x-3">
        <input
          key="agreeToTerms-checkbox"
          id="agreeToTerms"
          name="agreeToTerms"
          type="checkbox"
          checked={formData.agreeToTerms}
          onChange={handleChange}
          className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
        />
        <label htmlFor="agreeToTerms" className="text-sm text-gray-700 dark:text-gray-300">
          I agree to the{' '}
          <a href="#" className="text-orange-600 hover:text-orange-700 underline">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="#" className="text-orange-600 hover:text-orange-700 underline">
            Privacy Policy
          </a>
        </label>
      </div>
      {errors.agreeToTerms && (
        <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
      )}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <span>Continue to Image Upload</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  ), [formData, errors, handleFormSubmit, companyTypes, countryCodes, showPassword, showConfirmPassword, InputField]);

  // Step 2: Image Upload
  const ImageUploadStep = useMemo(() => (
    <form onSubmit={handleImageSubmit} className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Upload Profile Image
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please upload a professional profile photo to complete your registration
        </p>
      </div>

      <div className="space-y-4">
        {!imagePreview ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-orange-500 dark:hover:border-orange-400 transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="image-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Click to upload or drag and drop
                </span>
                <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                  PNG, JPG, JPEG up to 5MB
                </span>
              </label>
              <input
                key="image-upload-input"
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
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-full h-64 object-cover rounded-md"
              />
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-colors disabled:opacity-60 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Submit Registration</span>
              <CheckCircle className="w-5 w-5" />
            </>
          )}
        </button>
      </div>
    </form>
  ), [handleImageSubmit, imagePreview, handleImageChange, removeImage, isSubmitting]);

  // Step 3: Success
  const SuccessStep = useMemo(() => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
          <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Registration Submitted Successfully!
        </h2>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-2" />
            <span className="text-yellow-800 dark:text-yellow-400 font-semibold">
              Pending Admin Approval
            </span>
          </div>
          <p className="text-yellow-800 dark:text-yellow-400 text-sm">
            Your registration request has been submitted and is now pending approval from our super admin.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-left space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">Registration Details:</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><span className="font-medium">Company:</span> {formData.companyName}</p>
            <p><span className="font-medium">Email:</span> {formData.email}</p>
            <p><span className="font-medium">Phone:</span> {formData.countryCode}{formData.phoneNumber}</p>
            <p><span className="font-medium">Request ID:</span> {registrationId}</p>
            <p><span className="font-medium">Submitted:</span> {new Date().toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2">What happens next?</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 text-left">
            <li>• Our super admin will review your registration request</li>
            <li>• You'll receive an email notification once approved/rejected</li>
            <li>• Approval process typically takes 1-2 business days</li>
            <li>• After approval, you can log in and access all features</li>
          </ul>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => {
            setStep(1);
            setFormData({
              firstName: "",
              lastName: "",
              username: "",
              companyName: "",
              companyType: "",
              email: "",
              countryCode: "+1",
              phoneNumber: "",
              password: "",
              confirmPassword: "",
              agreeToTerms: false,
            });
            setSelectedImage(null);
            setImagePreview(null);
            setErrors({});
          }}
          className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
        >
          New Registration
        </button>
        <button
          onClick={() => {
            window.location.href = '/login';
          }}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  ), [formData, registrationId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        
        {/* Left Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 z-10" />
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
            alt="Business professionals"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-8 left-8 z-20 text-white">
            <h2 className="text-2xl font-bold mb-2">Join Our Network</h2>
            <p className="text-lg opacity-90">Connect with top talent and grow your business</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 overflow-y-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Company Registration
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Join our platform and connect with top talent
                </p>
              </div>
            </div>
            
            {ProgressIndicator}
          </div>

          {/* Render current step */}
          {step === 1 && RegistrationFormStep}
          {step === 2 && ImageUploadStep}
          {step === 3 && SuccessStep}
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationForm;
