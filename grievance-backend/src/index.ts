import app from './app';
import {Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config();
// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // For local development, set to true in production
  },
});
// Test the database connection
pool.connect()
  .then(() => {
    console.log('Connected to the PostgreSQL database');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  }); 


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Try accessing the test endpoint at:  http://localhost:${PORT}/api/test`);
});