import express from 'express';
import cookieParser from 'cookie-parser';
import config from './config.js';
import connectDB from './db.config.js';

import usersRouter from '../routes/users.router.js'
import petsRouter from '../routes/pets.router.js';
import adoptionsRouter from '../routes/adoption.router.js';
import sessionsRouter from '../routes/sessions.router.js';
import mockRouter from '../routes/mock.router.js';
import errorHandler from "../middlewares/errors/errorHandler.middleware.js"
import { midLogger } from '../middlewares/logger.middleware.js';
import { logger } from './logger.config.js';
import mongoose from 'mongoose';


export default function initializeServer(){

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(midLogger)
app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks',mockRouter)

app.use(errorHandler)
const server = app.listen(config.port,()=>{
    logger.info(`Listening on port ${config.port}`)
    connectDB()
})

mongoose.connection.on("error",()=>{
    logger.debug("Database connection error, closing server...")
    server.close(()=>{
        logger.debug("Server shutdown")
    })
})

}