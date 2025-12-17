import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import { generateUserErrorInfo, invalidRequest } from "../services/errors/info.error.js";
import CustomError from "../services/errors/CustomError.js";
import listError from "../services/errors/list.error.js";

const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) {
            const error = new CustomError(generateUserErrorInfo({ first_name, last_name, email, password }), listError.INVALID_TYPES_ERROR)
            return next(error)
        }
        const exists = await usersService.getUserByEmail(email);
        if (exists) {
            req.logger.warning("User already exists")
            return res.status(400).send({ status: "error", error: "User already exists" });
        }

        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        let result = await usersService.create(user);
        req.logger.debug(result);
        res.status(201).send({ status: "success", payload: result._id });
    } catch (error) {
        req.logger.error(`Error trying to create new user.`)
        res.status(500).send()
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            req.logger.warning("Incomplete values")
            return res.status(400).send({ status: "error", error: "Incomplete values" })}
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            const error = new CustomError(invalidRequest("user", email), listError.INVALID_REQUEST)
            return next(error)
        }
        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            req.logger.warning("Incorrect password")
            return res.status(400).send({ status: "error", error: "Incorrect password" })}
        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });
        req.logger.info("Logged in successfully!")
        res.cookie('coderCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Logged in" })
    } catch (error) {
        req.logger.error(`Error trying to login`)
        res.status(500).send()
    }
}

const current = async (req, res) => {
    try {
        const cookie = req.cookies['coderCookie']
        const user = jwt.verify(cookie, 'tokenSecretJWT');
        if (user){
            req.logger.info("Current user information retrieved")
            return res.send({ status: "success", payload: user })
        }
    } catch (error) {
        req.logger.error(`Error trying to get current session`)
        res.status(500).send()
    }
}

const unprotectedLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            req.logger.warning("Incomplete values")
            return res.status(400).send({ status: "error", error: "Incomplete values" })}
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            const error = new CustomError(invalidRequest("user", user.email), listError.INVALID_REQUEST)
            return next(error)
        }
        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            req.logger.warning("Incorrect password")
            return res.status(400).send({ status: "error", error: "Incorrect password" })}
        const token = jwt.sign(user, 'tokenSecretJWT', { expiresIn: "1h" });
        res.cookie('unprotectedCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Unprotected Logged in" })
        req.logger.info("Unprotected Logged in")
    } catch (error) {
        req.logger.error(`Error trying to unprotected login`)
        res.status(500).send()
    }
}
const unprotectedCurrent = async (req, res) => {
    try {
        const cookie = req.cookies['unprotectedCookie']
        const user = jwt.verify(cookie, 'tokenSecretJWT');
        if (user)
            return res.send({ status: "success", payload: user })
    } catch (error) {
        req.logger.error(`Error trying to get unprotected current session`)
        res.status(500).send()
    }
}

export default {
    current,
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}