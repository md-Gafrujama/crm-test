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

const app = express();
app.use(compression());

// CORS preflight handler - MUST be before other middleware
app.use((req, res, next) => {
  // Set CORS headers for all requests
  res.header('Access-Control-Allow-Origin', 'https://crm-test-eyrb.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token, X-Api-Version');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// Additional CORS middleware for extra safety
app.use(cors({
  origin: ['https://crm-test-eyrb.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  exposedHeaders: ['Content-Disposition'],
  optionsSuccessStatus: 200 // For legacy browser support
}));

app.use(express.json({ limit: '50mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

connectDB();

// Alert routes
import alertRouter from "./api/alerts/alerts.routes.js";
app.use("/api/alert", alertRouter);

// Auth routes
import changePass from "./api/auth/changePass.routes.js";
import loginRouter from "./api/auth/login.routes.js";
import updateUser from "./api/auth/updateUser.js";
import userProfile from "./api/auth/userProfile.routes.js";
import forgetPass1 from "./api/auth/OTP.routes.js";
import forgetPass2 from "./api/auth/conformPass.routes.js";
app.use("/api/editPass", changePass);
app.use("/api/login", loginRouter);
app.use("/api/updateUser", updateUser);
app.use("/api/userProfile", userProfile);
app.use("/api/forgetPass1", forgetPass1);
app.use("/api/forgetPass2", forgetPass2);

// Company routes
import company from "./api/company/companie.routes.js";
import otpForCompany from "./api/company/otp.routes.js";
app.use("/api/registerComp", company);
app.use("/api/companyOTP", otpForCompany);

// Customer routes
import allUser from "./api/customer/allUsers.routes.js";
import recentActivities from "./api/customer/recentActivities.api.js";
import addUser from "./api/customer/user.routes.js";
import userData from "./api/customer/userData.routes.js";
import editUser from "./api/customer/editProfile.routes.js";
app.use("/api/allUser", allUser);
app.use("/api/recent", recentActivities);
app.use("/api/addUser", addUser);
app.use("/api/usersData", userData);
app.use("/api", editUser);

// Employee routes
import employee from "./api/employee/employee.route.js";
import spEmployee from "./api/employee/employeeProfile.routes.js";
app.use("/api/employee", employee);
app.use("/api/spEmployee", spEmployee);

// External routes
import compBaz from "./api/external/compBaz.routes.js";
import qb2b from "./api/external/qb2b.routes.js";
app.use("/api/external/compBazar", compBaz);
app.use("/api/external/qb2b", qb2b);

// Leads routes
import exportLead from "./api/leads/exportLeads.js";
import leadsRoutes from "./api/leads/leads.routes.js";
app.use("/api/export", exportLead);
app.use("/api/leads", leadsRoutes);

// Security routes
import securityLock from "./api/security/security.routes.js";
app.use("/api/security", securityLock);

// Automate routes
import "./automate/automate.routes.js";

// Middleware imports
import updatePassword from "./middleware/updatePassword.middleware.js";
import jwtTokenMiddleware from "./middleware/jwtoken.middleware.js";

// Protected route
app.get("/api/protected-route", jwtTokenMiddleware, (req, res) => {
  res.json({
    message: 'Protected route accessed!',
    user: req.user
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to index page");
});

// Global error handler for CORS issues
app.use((err, req, res, next) => {
  // Ensure CORS headers are present even in error responses
  res.header('Access-Control-Allow-Origin', 'https://crm-test-eyrb.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://crm-test-eyrb.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
