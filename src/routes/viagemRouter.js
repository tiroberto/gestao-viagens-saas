import express from "express";
const viagemRouter = express.Router();
import authorize from "../middlewares/authorize.js";
import viagemController from "../controllers/viagemController.js";

viagemRouter.get("/viagem", authorize(["administrador","motorista"]), (req, res) => viagemController.getViagens(req, res));
viagemRouter.get("/viagem/:viagemId", authorize(["administrador","motorista"]), (req, res) => viagemController.getViagemByPk(req, res));
viagemRouter.post("/viagem", authorize(["administrador"]), (req, res) => viagemController.createViagem(req, res));
viagemRouter.put("/viagem/:viagemId", authorize(["administrador"]), (req, res) => viagemController.updateViagem(req, res));
viagemRouter.delete("/viagem/:viagemId", authorize(["administrador"]), (req, res) => viagemController.deleteViagem(req, res));

export default viagemRouter;