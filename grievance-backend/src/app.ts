import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import { errorHandler } from './middleware/errorHandler';
// import attachmentRoutes from './routes/attachmentRoutes';
// import grievanceRoutes from './routes/grievanceRoutes';

export const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// // Rate limiting middleware
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
// });
// app.use(limiter);
// Routes
// app.use('/api/attachments', attachmentRoutes);
// app.use('/api/grievances', grievanceRoutes);
// Error handling middleware
// app.use(errorHandler);
// Test endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Test endpoint is working!' });
});
// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});
// Export the app for use in other modules
export default app;
// This file sets up the Express application with middleware, routes, and error handling.
// It includes CORS, security headers, rate limiting, and a test endpoint.