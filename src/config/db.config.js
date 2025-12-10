import config from "./config.js";
import mongoose from "mongoose";

export default function connectDB(){
    try {
        const connection = mongoose.connect(config.mongoUrl)
        if(process.argv[3]=="dev"){console.log("Connected to local Mongo database!")}
        console.log("Connected to Mongo Atlas!")
    } catch (error) {
        console.log("Error trying to connect database")
    }
}
