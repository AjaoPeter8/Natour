import express from 'express';
import tourRouter from './routes/tourRoute.js';

const app = express();
app.use(express.json());




// ROUTES
app.use('/api/v1/tours', tourRouter);

export default app;