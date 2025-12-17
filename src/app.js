import express from 'express';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js'
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mockRouter from './routes/mock.router.js';
import errorHandler from "./middlewares/errors/errorHandler.middleware.js"
import { midLogger } from './middlewares/logger.middleware.js';
import { stream } from './config/logger.config.js';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from './config/swagger.config.js';
import swagerUiExpress from 'swagger-ui-express'


const app = express()

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swagerUiExpress.serve, swagerUiExpress.setup(specs))

app.use(midLogger)
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev", { stream: stream }))

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mockRouter)

app.use(errorHandler)

export default app