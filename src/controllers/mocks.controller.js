import { petsService, usersService } from "../services/index.js"
import { createMockPets, createMockUsers } from "../utils/mocks.js"


const mockPets = async (req,res)=>{
        let pets = createMockPets()
        res.send({status: "succes", quantity: pets.length, payload: pets})
}

const mockUsers = async (req,res)=>{
        let users = createMockUsers()
        res.send({status: "succes", quantity: users.length, payload: users})
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
export default {
    mockPets,
    mockUsers,
    mockData
}