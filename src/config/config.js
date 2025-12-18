import { Command } from "commander"
let mode = "dev"
const program = new Command()

program.option("--mode <mode>","Coding mode", "dev")
program.allowExcessArguments(true)
program.parse()
mode = program.opts().mode
try {
    process.loadEnvFile( mode==="dev"?`./.env.development`:`./.env.production`)
} catch (error) {
    console.log("File not found")
}
const test = process.env.npm_lifecycle_event.includes("test")

export default {
    mode: process.env.MODE,
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    mongoTest: process.env.MONGO_TEST_URL,
    test
}
