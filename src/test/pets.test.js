import { assert } from "chai";
import { createMockPets } from "../services/pets.mock.js";

describe("Mocking 100 pets",()=>{
    it("Should create 100 pets",()=>{
        let pets = createMockPets()
        assert.lengthOf(pets,100)
    })
})
