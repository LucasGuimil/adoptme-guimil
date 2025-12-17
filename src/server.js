import app from "./app.js"
import connectDB from "./config/db.config.js"
import { logger } from "./config/logger.config.js"
import config from "./config/config.js"

const initalizeServer = async ()=>{
    await connectDB()
    app.listen(config.port, () => {
    logger.info(`Listening on port http://localhost:${config.port}`)
    logger.info(`API documentation on http://localhost:${config.port}/apidocs`)
})}

initalizeServer()