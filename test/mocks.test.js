import { assert } from "chai";
import { createMockPets, createMockUsers } from "../src/utils/mocks.js";
import { describe, it } from "mocha";


describe("Mocking pets and users", function() {
    this.timeout(5000)
    it("Should create 100 pets", () => {
        let pets = createMockPets()
        assert.lengthOf(pets, 100)
    })

    it("Should create 50 users", () => {
        let users = createMockUsers()
        assert.lengthOf(users, 50)
    })
})



