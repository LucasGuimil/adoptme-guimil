import { logger } from "../config/logger.config.js"

export const midLogger = (req,res,next)=>{
    req.logger = logger
    next()
}
