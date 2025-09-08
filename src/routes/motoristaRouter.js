import express from "express";
const motoristaRouter = express.Router();
import authorize from "../middlewares/authorize.js";
import motoristaController from "../controllers/motoristaController.js";

motoristaRouter.get("/motorista", authorize(["administrador"]), (req, res) => motoristaController.getMotoristas(req, res));
motoristaRouter.get("/motorista/inativos", authorize(["administrador"]), (req, res) => motoristaController.getMotoristasInativos(req, res));
motoristaRouter.get("/motorista/:motoristaId", authorize(["administrador","motorista"]), (req, res) => motoristaController.getMotoristaByPk(req, res));
motoristaRouter.post("/motorista", authorize(["administrador"]), (req, res) => motoristaController.createMotorista(req, res));
motoristaRouter.put("/motorista/:motoristaId", authorize(["administrador","motorista"]), (req, res) => motoristaController.updateMotorista(req, res));
motoristaRouter.put("/motorista/inativar/:motoristaId", authorize(["administrador"]), (req, res) => motoristaController.inactivateMotorista(req, res));
motoristaRouter.put("/motorista/ativar/:motoristaId", authorize(["administrador"]), (req, res) => motoristaController.activateMotorista(req, res));
motoristaRouter.delete("/motorista/:motoristaId", authorize(["administrador"]), (req, res) => motoristaController.deleteMotorista(req, res));

export default motoristaRouter;