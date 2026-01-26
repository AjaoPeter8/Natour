import express from 'express';
import tourRouter from './routes/tourRoute.js';
import morgan from 'morgan';
import qs from 'qs';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';

const app = express();
app.use(express.json());
app.set('query parser', str => qs.parse(str));

app.use(express.static(`${import.meta.dirname}/public`));
app.use(morgan('dev'));


// ROUTES
app.use('/api/v1/tours', tourRouter);

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`,  404));
});

app.use(globalErrorHandler);

export default app;