import express from 'express';
import tourRouter from './routes/tourRoute.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoute.js'
import morgan from 'morgan';
import qs from 'qs';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';    
import mongoSanitize from '@exortek/express-mongo-sanitize'; 
import hpp from 'hpp';

const app = express();

// Set Security HHTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limits requests from same IP address
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests. Try again in an hour',
});
app.use('/api', limiter);

//Body Parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.set('query parser', (str) => qs.parse(str));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Preventing Parameter Pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}))

//Serve static files
app.use(express.static(`${import.meta.dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
