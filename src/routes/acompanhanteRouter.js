import express from "express";
const acompanhanteRouter = express.Router();
import authorize from "../middlewares/authorize.js";
import acompanhanteController from "../controllers/acompanhanteController.js";

acompanhanteRouter.get("/acompanhante", authorize(["administrador"]), (req, res) => acompanhanteController.getAcompanhantes(req, res));
acompanhanteRouter.get("/acompanhante/inativos", authorize(["administrador"]), (req, res) => acompanhanteController.getAcompanhantesInativos(req, res));
acompanhanteRouter.get("/acompanhante/:acompanhanteId", authorize(["administrador"]), (req, res) => acompanhanteController.getAcompanhanteByPk(req, res));
acompanhanteRouter.post("/acompanhante", authorize(["administrador"]), (req, res) => acompanhanteController.createAcompanhante(req, res));
acompanhanteRouter.put("/acompanhante/:acompanhanteId", authorize(["administrador"]), (req, res) => acompanhanteController.updateAcompanhante(req, res));
acompanhanteRouter.put("/acompanhante/inativar/:acompanhanteId", authorize(["administrador"]), (req, res) => acompanhanteController.inactivateAcompanhante(req, res));
acompanhanteRouter.put("/acompanhante/ativar/:acompanhanteId", authorize(["administrador"]), (req, res) => acompanhanteController.activateAcompanhante(req, res));
acompanhanteRouter.delete("/acompanhante/:acompanhanteId", authorize(["administrador"]), (req, res) => acompanhanteController.deleteAcompanhante(req, res));

export default acompanhanteRouter;