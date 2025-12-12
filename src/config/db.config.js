import config from "./config.js";
import mongoose from "mongoose";
import { logger } from "./logger.config.js";

export default function connectDB(){
    logger.debug("Connecting database...")
    mongoose.connect(config.mongoUrl)
        .then(()=>{
            if(config.mode==="dev") return logger.info("Connected to local Mongo database!")
            logger.info("Connected to Mongo Atlas!")
        })
        .catch((error)=>{
            logger.fatal("Error trying to connect database.")
        })
}
