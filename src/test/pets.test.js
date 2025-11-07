import { assert } from "chai";
import { createMockPets, createMockUsers } from "../utils/mocks.js";

describe("Mocking 100 pets",()=>{
    it("Should create 100 pets",()=>{
        let pets = createMockPets()
        assert.lengthOf(pets,100)
    })
})

describe("Mocking 50 users",()=>{
    it("Should create 50 users",()=>{
        let users = createMockUsers()
        assert.lengthOf(users,50)
    })
})

