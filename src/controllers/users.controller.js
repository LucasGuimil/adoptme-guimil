import { isValidObjectId } from "mongoose";
import { usersService } from "../services/index.js"
import CustomError from "../services/errors/CustomError.js";
import { invalidIdErrorInfo } from "../services/errors/info.js";
import eErrors from "../services/errors/enums.js";

const getAllUsers = async(req,res)=>{
    const users = await usersService.getAll();
    res.send({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    const userId = req.params.uid;  
    if(!isValidObjectId(userId)){
        CustomError.createError({
            name: "Invalid ID error",
            cause: invalidIdErrorInfo(userId),
            message: "Error trying to find user by ID",
            code: eErrors.INVALID_PARAM_ERROR
        })
    }
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error",error:"User not found"})
    res.send({status:"success",payload:user})
}

const updateUser =async(req,res)=>{
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error", error:"User not found"})
    const result = await usersService.update(userId,updateBody);
    res.send({status:"success",message:"User updated"})
}

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    const result = await usersService.getUserById(userId);
    res.send({status:"success",message:"User deleted"})
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
}