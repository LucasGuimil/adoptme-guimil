import { faker } from "@faker-js/faker";
import bcrypt from 'bcrypt';

export const createMockPets = (q) => {
    const quantity = q ?? 100
    let pets = []
    for(let i = 0; i <quantity ; i++ ) {
        let pet = {
            _id: faker.database.mongodbObjectId(),
            name: faker.animal.petName(),
            specie: faker.animal.type(),
            birthDate: faker.date.birthdate(),
            adopted: false,
            image: faker.image.avatar()
        }
        pets.push(pet)
    }   
    return pets
}


export const createMockUsers = (q) => {
    const quantity = q ?? 50
    let users = []
    for(let i = 0; i <quantity ; i++ ) {
        let user = {
            _id: faker.database.mongodbObjectId(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: bcrypt.hashSync("coder123",10),
            role: faker.helpers.arrayElement(["user","admin"]),
            pets: []
        }
        users.push(user)
    }   
    return users
}
