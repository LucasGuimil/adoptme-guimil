import { faker } from "@faker-js/faker";

export const createMockPets = () => {
    let pets = []
    for(let i = 0; i <100 ; i++ ) {
        let pet = {
            _id: faker.database.mongodbObjectId,
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
