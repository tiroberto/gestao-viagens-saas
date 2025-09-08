import express from "express";
const statusViagemRouter = express.Router();
import statusViagemController from "../controllers/statusViagemController.js";

statusViagemRouter.get("/status-viagem", (req, res) => statusViagemController.getStatusViagem(req, res));
statusViagemRouter.get("/status-viagem/:statusViagemId", (req, res) => statusViagemController.getStatusViagemByPk(req, res));
statusViagemRouter.post("/status-viagem", (req, res) => statusViagemController.createStatusViagem(req, res));
statusViagemRouter.put("/status-viagem/:statusViagemId", (req, res) => statusViagemController.updateStatusViagem(req, res));
statusViagemRouter.delete("/status-viagem/:statusViagemId", (req, res) => statusViagemController.deleteStatusViagem(req, res));

export default statusViagemRouter;