// const allowedOrigins = [
//   'https://crm-test-eyrb.vercel.app',
//   //'http://localhost:5173',
//   // 'https://our-crm-website.vercel.app'
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

// export default corsMiddleware;














const allowedOrigins = [
  'https://crm-test-eyrb.vercel.app',
  'http://localhost:5173', // Uncommented for local development
  
];

const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow requests from allowed origins or requests with no origin
  if (allowedOrigins.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};

export default corsMiddleware;
