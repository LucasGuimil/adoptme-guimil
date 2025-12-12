import config from "../config/config.js"
import { petsService, usersService } from "../services/index.js"
import { createMockPets, createMockUsers } from "../utils/mocks.js"


const mockPets = async (req,res)=>{
        let pets = createMockPets()
        res.send({status: "succes", quantity: pets.length, payload: pets})
}

const mockUsers = async (req,res)=>{
        let users = createMockUsers()
        res.send({status: "success", quantity: users.length, payload: users})
}

const mockData = async (req,res)=> {
    const {users = 0, pets=0 } = req.body
    if ( !users && !pets) return res.status(400).send("No information has been provided.")
    let u = createMockUsers(users)
    let p = createMockPets(pets)
    try {   
        await usersService.create(u)
        await petsService.create(p)
        res.send({status: "success", users: u, pets: p})
    } catch (error) {
        res.status(500).send(error)
    }
}

const loggerTest = async (req,res) => {
    req.logger.fatal(`Fatal error in ${config.mode} mode.`)
    req.logger.error(`Error in ${config.mode} mode.`)
    req.logger.warning(`Warning in ${config.mode} mode.`)
    req.logger.info(`Info message in ${config.mode} mode.`)
    req.logger.http(`HTTP info in ${config.mode} mode.`)
    req.logger.debug(`Debug message in ${config.mode} mode.`)
    res.status(204).send()
}
export default {
    mockPets,
    mockUsers,
    mockData,
    loggerTest
}