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
describe("Integration tests of AdoptMe project, route /api/sessions/", function () {
    this.timeout(5000)
    describe("POST method to register a new user on route /register", function () {
        before(async () => {
            await mongoose.connection.dropCollection("users")
        })
        it("Creates a new user with complete information", async () => {
            const validUserInfo = {
                first_name: "John",
                last_name: "Smith",
                email: "mail@example.com",
                password: "123456"
            }
            const result = await requester.post("/api/sessions/register").send(validUserInfo)
            expect(result.statusCode).to.be.eql(201)
        })
        it("Returns an error when the mail already exists in the database", async () => {
            const repeatedMail = {
                first_name: "Neo",
                last_name: "Anderson",
                email: "mail@example.com",
                password: "ABCDEF"
            }
            const result = await requester.post("/api/sessions/register").send(repeatedMail)
            expect(result.statusCode).to.be.eql(400)
        })
        it("Returns an error when a required property is missing", async () => {
            const invalidInfo = {
                last_name: "Morpheus",
                email: "example@mail.com",
                password: "ABCDEF"
            }
            const result = await requester.post("/api/sessions/register").send(invalidInfo)
            expect(result.statusCode).to.be.eql(400)
        })
    })
    describe("Login tests on route /login and return information on /current", function () {
        let cookie
        it("Login: Return an error when the request body is not complete", async () => {
            const invalidRequest = {
                email: "mail@example.com"
            }
            const result = await requester.post("/api/sessions/login").send(invalidRequest)
            expect(result.statusCode).to.be.eql(400)
            expect(result.body.status).to.be.eql("error")
        })
        it("Login: Return an error when the email doesn't exists in the database", async () => {
            const invalidUser = {
                email: "example@mail.com",
                password: "123456"
            }
            const result = await requester.post("/api/sessions/login").send(invalidUser)
            expect(result.statusCode).to.be.eql(404)
            expect(result.body.status).to.be.eql("error")
        })
        it("Login: Return an error when the password is invalid", async () => {
            const invalidPass = {
                email: "mail@example.com",
                password: "456789"
            }
            const result = await requester.post("/api/sessions/login").send(invalidPass)
            expect(result.statusCode).to.be.eql(400)
            expect(result.body.status).to.be.eql("error")
        })
        it("Login: Succesfully login of an existing user and return the jwt cookie", async () => {
            const validUser = {
                email: "mail@example.com",
                password: "123456"
            }
            const result = await requester.post("/api/sessions/login").send(validUser)
            const cookieResult = result.headers["set-cookie"][0]
            expect(cookieResult).to.be.ok
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }
            expect(cookie.name).to.be.eql("coderCookie")
            expect(cookie.value).to.be.ok
        })
        it("Current: received the cookie and show user information correctly",async()=>{
            const result = await requester.get("/api/sessions/current").set("Cookie",[`${cookie.name}=${cookie.value}`])
            expect(result.body.payload.email).to.be.eql("mail@example.com")
            expect(result.body.payload.name).to.be.eql("John Smith")
        })
    })
})