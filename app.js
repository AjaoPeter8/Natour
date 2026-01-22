import express from 'express';
import tourRouter from './routes/tourRoute.js';
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(express.static(`${import.meta.dirname}/public`));
app.use(morgan('dev'));




// ROUTES
app.use('/api/v1/tours', tourRouter);

export default app;