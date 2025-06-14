import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import grievanceRoutes from './routes/grievance.routes';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/api/grievances', grievanceRoutes);

export default app;
