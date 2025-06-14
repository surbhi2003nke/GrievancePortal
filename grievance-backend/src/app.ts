import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Welcome to Grievance Portal API' });
});

export default app;
