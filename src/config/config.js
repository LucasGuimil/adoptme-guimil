import dotenv from "dotenv"
import { Command } from "commander"

const program = new Command()

program.option("--mode <mode>","Coding mode","prod")
program.parse()
const options = program.opts()
dotenv.config({debug: true, path: options.mode==="dev"?`./.env.development`:`./.env.production`})

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
}
