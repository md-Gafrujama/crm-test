// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import jwt from "jsonwebtoken";
// import connectDB from "./prisma/dbConnect.js";
// import compression from "compression";
// import cron from "node-cron";

// const app = express();
// app.use(compression());

// app.use(cors({
//   origin: [ 'https://crm-test-eyrb.vercel.app'], // Removed trailing slash
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   exposedHeaders: ['Content-Disposition'],
  
// }));

// app.use(express.json()); 

// connectDB();

//   import alertRouter from "./api/alerts/alerts.routes.js";
//   app.use("/api/alert",alertRouter);

//   import changePass from "./api/auth/changePass.routes.js";
//   import loginRouter from "./api/auth/login.routes.js";
//   import updateUser from "./api/auth/updateUser.js";
//   import userProfile from "./api/auth/userProfile.routes.js";
//   import forgetPass1 from "./api/auth/OTP.routes.js";
//   import forgetPass2 from "./api/auth/conformPass.routes.js";
//   app.use("/api/editPass",changePass);
//   app.use("/api/login",loginRouter);
//   app.use("/api/updateUser",updateUser);
//   app.use("/api/userProfile",userProfile);
//   app.use("/api/forgetPass1",forgetPass1);
//   app.use("/api/forgetPass2",forgetPass2);

//   import company from "./api/company/companie.routes.js";
//   import otpForCompany from "./api/company/otp.routes.js";
//   app.use("/api/registerComp",company);
//   app.use("/api/companyOTP",otpForCompany)

//   import allUser  from "./api/customer/allUsers.routes.js";
//   import recentActivities from "./api/customer/recentActivities.api.js";
//   import addUser from "./api/customer/user.routes.js";
//   import userData  from "./api/customer/userData.routes.js";
//   import editUser from "./api/customer/editProfile.routes.js"
//   app.use("/api/allUser",allUser);
//   app.use("/api/recent",recentActivities);
//   app.use("/api/addUser",addUser);
//   app.use("/api/usersData",userData);
//   app.use("/api",editUser);

//   import employee from "./api/employee/employee.route.js";
//   import spEmployee from "./api/employee/employeeProfile.routes.js";
//   app.use("/api/employee",employee);
//   app.use("/api/spEmployee",spEmployee);

//   import compBaz from "./api/external/compBaz.routes.js";
//   import qb2b from "./api/external/qb2b.routes.js";
//   app.use("/api/external/compBazar",compBaz);
//   app.use("/api/external/qb2b",qb2b);

//   import exportLead from "./api/leads/exportLeads.js";
//   import leadsRoutes from "./api/leads/leads.routes.js";
//   app.use("/api/export", exportLead); 
//   app.use("/api/leads",leadsRoutes);

//   import securityLock from "./api/security/security.routes.js";
//   app.use("/api/security",securityLock);

//   import "./automate/automate.routes.js";

// import updatePassword from "./middleware/updatePassword.middleware.js";
// import jwtTokenMiddleware from "./middleware/jwtoken.middleware.js"; 

// app.get("/api/protected-route", jwtTokenMiddleware, (req, res) => {
//   res.json({
//     message: 'Protected route accessed!',
//     user: req.user
//   });
// });

// app.get("/", (req, res) => {
//   res.send("Welcome to index page");
// });

// const port = process.env.PORT || 3333;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// export default app;


import express from "express";
import "dotenv/config";
import cors from "cors";
import jwt from "jsonwebtoken";
import connectDB from "./prisma/dbConnect.js";
import compression from "compression";
import cron from "node-cron";

// Import middleware
import updatePassword from "./middleware/updatePassword.middleware.js";
import jwtTokenMiddleware from "./middleware/jwtoken.middleware.js";

// Import all routes
import alertRouter from "./api/alerts/alerts.routes.js";
import changePass from "./api/auth/changePass.routes.js";
import loginRouter from "./api/auth/login.routes.js";
import updateUser from "./api/auth/updateUser.js";
import userProfile from "./api/auth/userProfile.routes.js";
import forgetPass1 from "./api/auth/OTP.routes.js";
import forgetPass2 from "./api/auth/conformPass.routes.js";
import company from "./api/company/companie.routes.js";
import otpForCompany from "./api/company/otp.routes.js";
import allUser from "./api/customer/allUsers.routes.js";
import recentActivities from "./api/customer/recentActivities.api.js";
import addUser from "./api/customer/user.routes.js";
import userData from "./api/customer/userData.routes.js";
import editUser from "./api/customer/editProfile.routes.js";
import employee from "./api/employee/employee.route.js";
import spEmployee from "./api/employee/employeeProfile.routes.js";
import compBaz from "./api/external/compBaz.routes.js";
import qb2b from "./api/external/qb2b.routes.js";
import exportLead from "./api/leads/exportLeads.js";
import leadsRoutes from "./api/leads/leads.routes.js";
import securityLock from "./api/security/security.routes.js";

// Import automation routes
import "./automate/automate.routes.js";

const app = express();

// Enable compression
app.use(compression());

// CORS Configuration - FIXED FOR VERCEL
const corsOptions = {
  origin: [

    'http://localhost:5173', // Vite dev server
    'https://crm-test-eyrb.vercel.app', // Your current Vercel URL
    'https://*.vercel.app', // Allow all Vercel preview deployments
    process.env.VITE_API_BASE_URL, // Environment variable for flexibility
  ].filter(Boolean), // Remove undefined values
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-File-Name'
  ],
  exposedHeaders: ['Content-Disposition'],
  optionsSuccessStatus: 200, // For legacy browser support
  preflightContinue: false,
};

// Apply CORS with proper error handling
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Body parsing middleware with increased limits for file uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  console.log('Origin:', req.get('Origin'));
  next();
});

// Connect to database
connectDB();

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CRM API",
    status: "Server is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API is healthy",
    timestamp: new Date().toISOString()
  });
});

// Protected route example
app.get("/api/protected-route", jwtTokenMiddleware, (req, res) => {
  res.json({
    message: 'Protected route accessed!',
    user: req.user
  });
});

// Auth routes
app.use("/api/editPass", changePass);
app.use("/api/login", loginRouter);
app.use("/api/updateUser", updateUser);
app.use("/api/userProfile", userProfile);
app.use("/api/forgetPass1", forgetPass1);
app.use("/api/forgetPass2", forgetPass2);

// Company routes
app.use("/api/registerComp", company);
app.use("/api/companyOTP", otpForCompany);

// Customer routes
app.use("/api/allUser", allUser);
app.use("/api/recent", recentActivities);
app.use("/api/addUser", addUser);
app.use("/api/usersData", userData);
app.use("/api", editUser);

// Employee routes
app.use("/api/employee", employee);
app.use("/api/spEmployee", spEmployee);

// External API routes
app.use("/api/external/compBazar", compBaz);
app.use("/api/external/qb2b", qb2b);

// Leads routes
app.use("/api/export", exportLead);
app.use("/api/leads", leadsRoutes);

// Security routes
app.use("/api/security", securityLock);

// Alert routes
app.use("/api/alert", alertRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      error: err.message
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: err.message
    });
  }
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File too large',
      error: 'Maximum file size is 10MB'
    });
  }
  
  // Generic error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      '/api/health',
      '/api/login',
      '/api/addUser',
      '/api/leads',
      // Add more main endpoints as needed
    ]
  });
});

const port = process.env.PORT || 3333;

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for: ${corsOptions.origin.join(', ')}`);
});

export default app;