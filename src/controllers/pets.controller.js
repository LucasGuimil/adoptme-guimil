import PetDTO from "../dto/Pet.dto.js";
import { generatePetErrorInfo, invalidRequest } from "../services/errors/info.error.js";
import listError from "../services/errors/list.error.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";

const getAllPets = async (req, res) => {
    try {
        const pets = await petsService.getAll();
        res.send({ status: "success", payload: pets })
    } catch (error) {
        req.logger.error("Error trying to get all pets.")
        res.status(500).send({ status: error, message: "Error trying to get all pets." })
    }
}

const createPet = async (req, res, next) => {
    try {
        const { name, specie, birthDate } = req.body;
        if (!name || !specie || !birthDate) {
            const error = new CustomError(generatePetErrorInfo({ name, specie, birthDate }), listError.INVALID_TYPES_ERROR)
            return next(error)
        }
        const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
        const result = await petsService.create(pet);
        if (result) {
            req.logger.info("Pet created succesfully!")
            res.send({ status: "success", payload: result })
        }
    } catch (error) {
        req.logger.error(`Error trying to create new pet.`)
        res.status(500).send()
    }
}

const updatePet = async (req, res, next) => {
    const petUpdateBody = req.body;
    const petId = req.params.pid;
    try {
        const result = await petsService.update(petId, petUpdateBody);
        if (!result) {
            const error = new CustomError(invalidRequest("pet", petId), listError.INVALID_REQUEST)
            return next(error)
        }
        res.send({ status: "success", message: "pet updated" })
    } catch (error) {
        req.logger.error(`Error trying to update pet's information.`)
        res.status(500).send()
    }
}

const deletePet = async (req, res, next) => {
    const petId = req.params.pid;
    try {
        const result = await petsService.delete(petId);
        if (!result) {
            const error = new CustomError(invalidRequest("pet", petId), listError.INVALID_REQUEST)
            return next(error)
        }
        req.logger.info("Pet deleted!")
        res.send({ status: "success", message: "pet deleted" });
    } catch (error) {
        req.logger.error(`Error trying to delete pet.`)
        res.status(500).send()
    }
}

const createPetWithImage = async (req, res, next) => {
    const file = req.file;
    const { name, specie, birthDate } = req.body;
    try {
        if (!name || !specie || !birthDate) {
            const error = new CustomError(generatePetErrorInfo({ name, specie, birthDate }), listError.INVALID_TYPES_ERROR)
            return next(error)
        }
        req.logger.debug(file);
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image: `${__dirname}/../public/img/${file.filename}`
        });
        req.logger.debug(pet);
        const result = await petsService.create(pet);
        res.send({ status: "success", payload: result })
    } catch (error) {
        req.logger.error(`Error trying to create pet with image.`)
        res.status(500).send()
    }
}

export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}