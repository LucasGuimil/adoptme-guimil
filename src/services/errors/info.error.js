export const generateUserErrorInfo = (user)=> {
    return `One or more properties are incomplete or invalid.
    Required properties:
    - first_name: should be a String, received ${user.first_name}
    - last_name: should be a String, received ${user.last_name}
    - email: should be a String, received ${user.email}
    - password: should be a String, received ${user.first_name}
    `
}

export const generatePetErrorInfo = (pet)=> {
    return `One or more properties are incomplete or invalid.
    Required properties:
    - name: should be a String, received ${pet.name}
    - specie: should be a String, received ${pet.specie}
    - birthDate: should be a Date, received ${pet.birthDate}
    `
}

export const invalidRequest = (type, data) => {
    return `The required ${type} with value ${data} is not found in our database.`
}