import config from "./config.js";
import mongoose from "mongoose";
import { logger } from "./logger.config.js";
import {finished} from "node:stream/promises"

const connectDB = async ()=>{
    logger.debug("Connecting database...")
    try {
        await mongoose.connect(config.mongoUrl)
        if(config.mode==="dev"){
            logger.info("Connected to local Mongo database!")
        } else {
            logger.info("Connected to Mongo Atlas!")
        }
    } catch (error) {
        logger.fatal(`Error trying to connect database.`)
        logger.end()    
        await finished(logger)
        process.exit(1)
    }
}

export default connectDB