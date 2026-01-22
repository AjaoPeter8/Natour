import express from 'express';
import tourRouter from './routes/tourRoute.js';
import morgan from 'morgan';
import qs from 'qs';

const app = express();
app.use(express.json());
app.set('query parser', str => qs.parse(str));
app.use(express.static(`${import.meta.dirname}/public`));
app.use(morgan('dev'));




// ROUTES
app.use('/api/v1/tours', tourRouter);

export default app;