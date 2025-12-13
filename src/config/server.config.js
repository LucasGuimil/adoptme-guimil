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
import { logger, stream } from './logger.config.js';
import morgan from 'morgan';



const initializeServer = async ()=> {

    const app = express();
    await connectDB()

    app.use(express.json());
    app.use(cookieParser());
    app.use(midLogger)
    app.use(morgan("dev",{stream: stream}))
    app.use('/api/users', usersRouter);
    app.use('/api/pets', petsRouter);
    app.use('/api/adoptions', adoptionsRouter);
    app.use('/api/sessions', sessionsRouter);
    app.use('/api/mocks', mockRouter)

    app.use(errorHandler)
    app.listen(config.port, () => {logger.info(`Listening on port ${config.port}`)})
}

export default initializeServer