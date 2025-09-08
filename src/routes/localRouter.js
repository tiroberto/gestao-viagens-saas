import express from "express";
const localRouter = express.Router();
import authorize from "../middlewares/authorize.js";
import localController from "../controllers/localController.js";

localRouter.get("/local", authorize(["administrador"]), (req, res) => localController.getLocais(req, res));
localRouter.get("/local/:localId", authorize(["administrador"]), (req, res) => localController.getLocalByPk(req, res));
localRouter.post("/local", authorize(["administrador"]), (req, res) => localController.createLocal(req, res));
localRouter.put("/local/:localId", authorize(["administrador"]), (req, res) => localController.updateLocal(req, res));
localRouter.delete("/local/:localId", authorize(["administrador"]), (req, res) => localController.deleteLocal(req, res));

export default localRouter;