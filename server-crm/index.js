import express from "express";
import "dotenv/config";
import cors from "cors";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./prisma/dbConnect.js";
import compression from "compression";
import analyticsScheduler from "./utilis/analyticsScheduler.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://crm-test-eyrb.vercel.app', "http://localhost:5173"],
    credentials: true
  }
});

app.use(compression());

app.use(cors({
  origin: ['https://crm-test-eyrb.vercel.app', "http://localhost:5173"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition'],
}));


app.use(express.json());

connectDB();

import alertRouter from "./api/alerts/alerts.routes.js";
app.use("/api/alert", alertRouter);

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

import company from "./api/company/companie.routes.js";
app.use("/api/registerComp", company);

import adminAnalytics from "./api/admin/analytics.routes.js";
import gaAnalytics from "./api/analytics/analytics.routes.js";
import { handleGoogleAnalyticsCallback } from "./api/analytics/callback.controller.js";
app.use("/api/analytics", adminAnalytics);
app.use("/api/ga", gaAnalytics);

// Google Analytics OAuth callback route
app.get("/google-analytics-callback", handleGoogleAnalyticsCallback);
import analyticsRoutes from "./api/otherGoogleApp/otherGoogle.router.js";
app.use("/api/analytics", analyticsRoutes);

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

import employee from "./api/employee/employee.route.js";
import spEmployee from "./api/employee/employeeProfile.routes.js";
app.use("/api/employee", employee);
app.use("/api/spEmployee", spEmployee);

import compBaz from "./api/external/compBaz.routes.js";
import qb2b from "./api/external/qb2b.routes.js";
app.use("/api/external/compBazar", compBaz);
app.use("/api/external/qb2b", qb2b);

import googleCalendarRoutes from "./api/googleCalendar/googleCalendar.routes.js";
app.use("/api/calendar", googleCalendarRoutes);

import exportLead from "./api/leads/exportLeads.js";
import leadsRoutes from "./api/leads/leads.routes.js";
app.use("/api/export", exportLead);
app.use("/api/leads", leadsRoutes);

import securityLock from "./api/security/security.routes.js";
app.use("/api/security", securityLock);

import "./automate/automate.routes.js";

import superAdmin from "./api/superAdmin/superAmin.routes.js";
app.use("/api/superAdmin", superAdmin);


import updatePassword from "./middleware/updatePassword.middleware.js";
import jwtTokenMiddleware from "./middleware/jwtoken.middleware.js";

app.get("/api/protected-route", jwtTokenMiddleware, (req, res) => {
  res.json({
    message: 'Protected route accessed!',
    user: req.user
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to index page");
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join company-specific room
  socket.on('join-company', (companyId) => {
    socket.join(`company-${companyId}`);
    console.log(`Socket ${socket.id} joined company-${companyId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io available globally for analytics updates
app.set('io', io);

const port = process.env.PORT || 3333;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  
  // Start analytics scheduler for real-time updates
  analyticsScheduler.start();
});

export default app;
export { io };