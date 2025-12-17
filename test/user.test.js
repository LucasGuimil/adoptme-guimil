import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import { describe, it } from "mocha";
import mongoose from "mongoose";
import config from "../src/config/config.js";
import { usersService } from "../src/services/index.js";

mongoose.set("strictQuery", true)

await mongoose.connect(config.mongoTest)
    .then(() => {
        console.log("Connected to test database!")
    })
    .catch((error) => { console.log("Error connecting to test database") })

const requester = supertest(app)

describe("Integration tests of AdoptMe project, route /api/users/", function () {
    this.timeout(5000)
    describe("GET method", function () {
        it("Return all users in the database as an array", async () => {
            const result = await requester.get("/api/users")
            expect(result.statusCode).to.be.eql(200)
            expect(Array.isArray(result._body.payload)).to.be.ok
        })
    describe("GET method on /api/users/:uid", function(){
        before(async () => {
            await mongoose.connection.dropCollection("users")
        })
        let originalUser
        it("Creates a new user and save the id", async () => {
            const validUserInfo = {
                first_name: "John",
                last_name: "Smith",
                email: "mail@example.com",
                password: "123456"
            }
            originalUser = await usersService.create(validUserInfo)
            expect(originalUser).to.have.property("_id")
        })
        it("Return one user from the database by ID", async () => {
            const result = await requester.get(`/api/users/${originalUser._id}`)
            expect(result.statusCode).to.be.eql(200)
            expect(result._body.payload).to.have.property("first_name")
        })
    })
    })
    describe("PUT method on route /api/users/:uid", function () {
        before(async () => {
            await mongoose.connection.dropCollection("users")
        })
        let originalUser
        it("Creates a new user and save the id", async () => {
            const validUserInfo = {
                first_name: "John",
                last_name: "Smith",
                email: "mail@example.com",
                password: "123456"
            }
            originalUser = await usersService.create(validUserInfo)
            expect(originalUser).to.have.property("_id")
        })
        it("Search in the database for the id and update user with new information", async () => {
            const newInfo = { first_name: "Robert", email: "robert@mail.com" }
            const { statusCode } = await requester.put(`/api/users/${originalUser._id}`).send(newInfo)
            const updatedUser = (await requester.get(`/api/users/${originalUser._id}`)).body.payload
            expect(statusCode).to.be.eql(200)
            expect(updatedUser.first_name != originalUser.first_name).to.be.ok
            expect(updatedUser.email != originalUser.email).to.be.ok
        })
    })
    describe("DELETE method", function () {
        before(async () => {
            await mongoose.connection.dropCollection("users")
        })
        let originalUser
        it("Creates a new user and save the id", async () => {
            const validUserInfo = {
                first_name: "John",
                last_name: "Smith",
                email: "mail@example.com",
                password: "123456"
            }
            originalUser = await usersService.create(validUserInfo)
            expect(originalUser).to.have.property("_id")
        })
        it("Search in the database for the id and delete the user", async () => {
            const result = await requester.delete(`/api/users/${originalUser._id}`)
            const deleted = await requester.get(`/api/users/${originalUser._id}`)
            expect(result.statusCode).to.be.eql(200)
            expect(deleted.statusCode).to.be.eql(404)
        })
    })
})

