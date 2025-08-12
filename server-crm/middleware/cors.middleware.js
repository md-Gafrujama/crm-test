// const allowedOrigins = [
//   'https://crm-test-eyrb.vercel.app',
//   'http://localhost:5173',
 
// ];

// const corsMiddleware = (req, res, next) => {
//   const origin = req.headers.origin;
  
//   if (allowedOrigins.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
  
//   res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Credentials', 'true');
  
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(200);
//   }
  
//   next();
// };
// cors.middleware.js
import cors from 'cors';

const corsMiddleware = cors({
  origin: ['https://crm-test-eyrb.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

export default corsMiddleware;
