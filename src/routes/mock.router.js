import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";

const mockRouter = Router()

mockRouter.get("/mockingpets",mocksController.mockPets)
mockRouter.get("/mockingusers",mocksController.mockUsers)
mockRouter.post("/generateData",mocksController.mockData)



export default mockRouter