import express from 'express';
import cookieParser from 'cookie-parser';
import config from './config.js';
import connectDB from './db.config.js';

import usersRouter from '../routes/users.router.js'
import petsRouter from '../routes/pets.router.js';
import adoptionsRouter from '../routes/adoption.router.js';
import sessionsRouter from '../routes/sessions.router.js';
import mockRouter from '../routes/mock.router.js';
import errorHandler from "../middlewares/errors/index.js"

export default function initializeServer(){

const app = express();
connectDB()

app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks',mockRouter)

app.use(errorHandler)
app.listen(config.port,()=>console.log(`Listening on ${config.port}`))
}