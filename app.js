import express from 'express';
import tourRouter from './routes/tourRoute.js';
import userRouter from './routes/userRoutes.js';
import morgan from 'morgan';
import qs from 'qs';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json());
app.set('query parser', str => qs.parse(str));

app.use(express.static(`${import.meta.dirname}/public`));

if (process.env.NODE_ENV === 'development'){
app.use(morgan('dev'));
}

const limiter = rateLimit ({
    max: 100,
    windowMs: 60*60*1000,
    message: 'Too many requests. Try again in an hour'
});

app.use('/api', limiter);




app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
    
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`,  404));
});

app.use(globalErrorHandler);

export default app;