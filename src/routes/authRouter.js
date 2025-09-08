import express from "express";
const authRouter = express.Router();
import authController from "../controllers/authController.js";

authRouter.post("/login", (req, res) => authController.login(req, res));

export default authRouter;