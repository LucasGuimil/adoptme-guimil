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

describe("Integration tests of AdoptMe project on adoption routes", function () {
    this.timeout(5000)
    describe("POST method to create new adoption", function () {
        before(async () => {
            await mongoose.connection.dropCollection("adoptions")
            await mongoose.connection.dropCollection("users")
            await mongoose.connection.dropCollection("pets")
        })
        let uid
        let pid
        let aid
        it("Creates a new user and save the id", async () => {
            const validUserInfo = {
                first_name: "Jack",
                last_name: "Sparrow",
                email: "captain@jacksparrow.com",
                password: "123456"
            }
            const { statusCode, body } = await requester.post("/api/sessions/register").send(validUserInfo)
            uid = body.payload
            expect(statusCode).to.be.eql(201)
        })
        it("Creates a new pet and save the id", async () => {
            const validPetInfo = {
                name: "Lio",
                specie: "Greyhound",
                birthDate: "2015-11-12"
            }
            const {statusCode,body} = await requester.post("/api/pets").send(validPetInfo)
            expect(statusCode).to.be.eql(201)
            pid = body.payload._id
        })
        it("Returns error 404 when doesn't find the user or the pet in the database",async()=>{
            const pets = (await requester.get("/api/pets")).body.payload
            const invalidPet = pets.find(pet => pet._id=== "InvalidPetID")
            const invalidUser = await requester.get("/api/users/69437215639e88ec72b39abb")
            expect(invalidPet).to.be.not.true
            expect(invalidUser.statusCode).to.be.eql(404)
        })
        it("Creates the adoption and updates the information on the pet and the user",async ()=> {
            const result = await requester.post(`/api/adoptions/${uid}/${pid}`)
            expect(result.statusCode).to.be.eql(201)
            aid = result.body.payload
            const pets = (await requester.get("/api/pets")).body.payload
            const updatedPet = pets.find(pet => pet._id=== pid)
            expect(updatedPet.adopted).to.be.true
            expect(updatedPet.owner).to.be.eql(uid)
            const updatedUser = (await requester.get(`/api/users/${uid}`)).body.payload
            expect(updatedUser.pets.find(pet=> pet._id === pid)).to.be.ok
        })
        
        let otherUserID
        it("Returns error 400 when the pet is already adopted", async ()=> {
            const validUserInfo = {
                first_name: "Frank",
                last_name: "Castle",
                email: "frank@punisher.com",
                password: "123456"
            }
            const { body } = await requester.post("/api/sessions/register").send(validUserInfo)
            otherUserID = body.payload
            const result = await requester.post(`/api/adoptions/${otherUserID}/${pid}`)
            expect(result.statusCode).to.be.eql(400)
        })
            describe("GET method", function () {
        it("Return all adoptions in the database as an array", async () => {
            const result = await requester.get("/api/adoptions")
            expect(result.statusCode).to.be.eql(200)
            expect(Array.isArray(result._body.payload)).to.be.ok
        })
        it("Return the adoption details from the database by ID", async () => {
            const result = await requester.get(`/api/adoptions/${aid}`)
            expect(result.statusCode).to.be.eql(200)
            expect(result._body.payload).to.have.property("_id")
        })

        })
    })
})
