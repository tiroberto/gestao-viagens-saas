import express from "express";
const logSistemaRouter = express.Router();
import authorize from "../middlewares/authorize.js";
import logSistemaController from "../controllers/logSistemaController.js";

logSistemaRouter.get("/log-sistema", authorize(["administrador"]), (req, res) => logSistemaController.getLogSistemasByReferencia(req, res));
logSistemaRouter.get("/log-sistema/:logSistemaId", authorize(["administrador"]), (req, res) => logSistemaController.getLogSistemaByPk(req, res));

export default logSistemaRouter;