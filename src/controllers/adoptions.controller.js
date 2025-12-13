import { adoptionsService, petsService, usersService } from "../services/index.js"
import { invalidRequest } from "../services/errors/info.error.js";

const getAllAdoptions = async (req, res) => {
    try {
        const result = await adoptionsService.getAll();
        res.send({ status: "success", payload: result })
    } catch (error) {
        req.logger.error("Error trying to get all adoptions.")
        res.status(500).send({ status: error, message: "Error trying to get all adoptions." })
    }
}

const getAdoption = async (req, res, next) => {
    const adoptionId = req.params.aid;
    try {
        const adoption = await adoptionsService.getBy({ _id: adoptionId })
        if (!adoption) {
            const error = new CustomError(invalidRequest("adoption", adoptionId), listError.INVALID_REQUEST)
            return next(error)
        }
        res.send({ status: "success", payload: adoption })
    } catch (error) {
        req.logger.error(`Error trying to get adoption: ${adoptionId}`)
        res.status(500).send({ status: error, message: `Error trying to get adoption: ${adoptionId}` })
    }
}

const createAdoption = async (req, res, next) => {
    const { uid, pid } = req.params;
    try {
        const user = await usersService.getUserById(uid);
        if (!user) {
            const error = new CustomError(invalidRequest("user", uid), listError.INVALID_REQUEST)
            return next(error)
        }
        const pet = await petsService.getBy({ _id: pid });
        if (!pet) {
            const error = new CustomError(invalidRequest("pet", pid), listError.INVALID_REQUEST)
            return next(error)
        }
        if (pet.adopted) {
            req.logger.warning("Pet is already adopted.")
            return res.status(400).send({ status: "error", error: "Pet is already adopted" })
        }
        user.pets.push(pet._id);
        await usersService.update(user._id, { pets: user.pets })
        await petsService.update(pet._id, { adopted: true, owner: user._id })
        await adoptionsService.create({ owner: user._id, pet: pet._id })
        req.logger.info("Adoption succesfull!")
        res.send({ status: "success", message: "Pet adopted" })
    } catch (error) {
        req.logger.error(`Error trying to create adoption.`)
        res.status(500).send({ status: error, message: `Error trying to create adoption.` })
    }
}

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
}