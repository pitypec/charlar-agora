import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import database from './config/database.js';
import userRoute from './router/userRouter.js';
import uploadRouter from './router/uploadRouter.js';
import postRouter from './router/postRouter.js';
import profileRouter from './router/profileRouter.js';
import swaggerSpec from './swaggerSpec.js';

dotenv.config();

const app = express();
database();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use('/users', userRoute);
app.use('/api', uploadRouter);
app.use('/api', postRouter);
app.use('/api/profile', profileRouter);
app.get('/', (req, res, next) => {
  return res.send('Welcome to btssocial');
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  const err = new Error('404 not found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : {};
  const status = err.status || 500;

  res.status(status).json({
    error: {
      message: error.message
    }
  });
});
export default app;
