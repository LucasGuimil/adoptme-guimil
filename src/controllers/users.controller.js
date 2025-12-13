import { usersService } from "../services/index.js"
import CustomError from "../services/errors/CustomError.js";
import { invalidRequest } from "../services/errors/info.error.js";
import listError from "../services/errors/list.error.js";

const getAllUsers = async (req, res) => {
    try {
        const users = await usersService.getAll();
        res.send({ status: "success", payload: users })
    } catch (error) {
        req.logger.error("Error trying to get all users.")
        res.status(500).send({ status: error, message: "Error trying to get all users." })
    }
}

const getUser = async (req, res, next) => {
    const userId = req.params.uid;
    try {
        const user = await usersService.getUserById(userId);
        if (!user) {
            const error = new CustomError(invalidRequest("user", userId), listError.INVALID_REQUEST)
            return next(error)
        }
        req.logger.info("User found succesfully!")
        res.send({ status: "success", payload: user })
    } catch (error) {
        req.logger.error(`Error trying to get user: ${userId}.`)
        res.status(500).send()
    }
}

const updateUser = async (req, res, next) => {
    const updateBody = req.body;
    const userId = req.params.uid;
    try {
        const user = await usersService.getUserById(userId);
        if (!user) {
            const error = new CustomError(invalidRequest("user", userId), listError.INVALID_REQUEST)
            return next(error)
        }
        const result = await usersService.update(userId, updateBody);
        res.send({ status: "success", message: "User updated" })
    } catch (error) {
        req.logger.error(`Error trying to update information of user: ${userId}.`)
        res.status(500).send()
    }
}

const deleteUser = async (req, res, next) => {
    const userId = req.params.uid;
    try {
        const result = await usersService.delete({ id: userId });
        if (!result) {
            const error = new CustomError(invalidRequest("user", userId), listError.INVALID_REQUEST)
            return next(error)
        }
        res.send({ status: "success", message: "User deleted" })
    } catch (error) {
        req.logger.error(`Error trying to delete user: ${userId}.`)
        res.status(500).send()
    }
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
}