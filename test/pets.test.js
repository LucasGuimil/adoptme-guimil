import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import { describe, it } from "mocha";
import mongoose from "mongoose";
import config from "../src/config/config.js";

mongoose.set("strictQuery", true)

await mongoose.connect(config.mongoTest)
    .then(() => {
        console.log("Connected to test database!")
    })
    .catch((error) => { console.log("Error connecting to test database") })

const requester = supertest(app)

describe("Integration tests of AdoptMe project, route /api/pets/", function () {
    this.timeout(5000)
    describe("GET method", function () {
        it("Return all pets in the database as an array", async () => {
            const result = await requester.get("/api/pets")
            expect(result.statusCode).to.be.eql(200)
            expect(Array.isArray(result._body.payload)).to.be.ok
        })
    })
    describe("POST method", function () {
        before(async () => {
            await mongoose.connection.dropCollection("pets")
        })
        it("Create a new pet on the database with correct input", async () => {
            const validPetInfo = {
                name: "Pepe",
                specie: "Toad",
                birthDate: "2025-11-12"
            }
            const result = await requester.post("/api/pets").send(validPetInfo)
            expect(result.statusCode).to.be.eql(201)
            expect(result._body.payload).to.have.property("_id")
            expect(result._body.payload.adopted).to.be.false
        })
        it("Return error 400 when required information is missing", async () => {
            const invalidPetInfo = {
                name: "Manuelita",
                birthDate: "2025-11-12"
            }
            const result = await requester.post("/api/pets").send(invalidPetInfo)
            expect(result.statusCode).to.be.eql(400)
        })
    })
    describe("PUT method on route /api/pets/:pid", function () {
        before(async () => {
            await mongoose.connection.dropCollection("pets")
        })
        let originalPet
        it("Creates a new pet and save the id", async () => {
            const validPet = {
                name: "Roco",
                specie: "Dog",
                birthDate: "2010-07-25"
            }
            const result = await requester.post("/api/pets").send(validPet)
            originalPet = result._body.payload
            expect(result._body.payload).to.have.property("_id")
        })
        it("Search in the database for the id and update with new information", async () => {
            const newInfo = { name: "Lio" }
            const { statusCode } = await requester.put(`/api/pets/${originalPet._id}`).send(newInfo)
            const pets = (await requester.get("/api/pets")).body.payload
            const updatedPet = pets.find(pet => pet._id === originalPet._id)

            expect(statusCode).to.be.eql(200)
            expect(updatedPet.name != originalPet.name).to.be.ok
        })
    })
    describe("DELETE method", function () {
        before(async () => {
            await mongoose.connection.dropCollection("pets")
        })
        let petToDelete
        it("Creates a new pet and save the id", async () => {
            const validPet = {
                name: "Roco",
                specie: "Dog",
                birthDate: "2010-07-25"
            }
            const result = await requester.post("/api/pets").send(validPet)
            petToDelete = result._body.payload
            expect(result._body.payload).to.have.property("_id")
        })
        it("Search in the database for the id and delete the pet", async () => {
            const { statusCode } = await requester.delete(`/api/pets/${petToDelete._id}`)
            const pets = (await requester.get("/api/pets")).body.payload
            const deleted = pets.find(pet => pet._id === petToDelete._id)
            expect(statusCode).to.be.eql(200)
            expect(deleted).to.be.undefined
        })
    })
    describe("POST method with image", function () {
        before(async () => {
            await mongoose.connection.dropCollection("pets")
        })
        it("Create a new pet on the database with correct input and image", async () => {
            const validPetInfo = {
                name: "Pepe",
                specie: "Toad",
                birthDate: "2025-11-12"
            }
            const result = await requester.post("/api/pets/withimage")
                .field("name", validPetInfo.name)
                .field("specie", validPetInfo.specie)
                .field("birthDate", validPetInfo.birthDate)
                .attach("image", "./test/image/coderDog.jpg")

            expect(result.statusCode).to.be.eql(201)
            expect(result._body.payload).to.have.property("_id")
            expect(result._body.payload.image).to.exist
        })
    })
})
