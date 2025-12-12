import config from "./config.js"
import winston from "winston"


const personalizedOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "black redBG bold",
        error: "red bold",
        warning: "yellow bold",
        info: "blue bold",
        http: "green bold",
        debug: "magenta bold"
    }
}

winston.addColors(personalizedOptions.colors)

const transportConsole = new winston.transports.Console({
    level: config.mode=="dev"?"debug":"info",
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({timestamp, level, message})=>{
            return `[${timestamp}] ${level}: ${message}`
        })
    )
})

const transportFile = new winston.transports.File({
    level: "error",
    filename: "./src/logs/error.log",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
})

export const logger = winston.createLogger({
    levels: personalizedOptions.levels,
    transports: [transportFile,transportConsole]
})

