import express from "express";
const pontoEmbarqueRouter = express.Router();
import authorize from "../middlewares/authorize.js";
import pontoEmbarqueController from "../controllers/pontoEmbarqueController.js";

pontoEmbarqueRouter.get("/ponto-embarque", authorize(["administrador"]), (req, res) => pontoEmbarqueController.getPontoEmbarque(req, res));
pontoEmbarqueRouter.get("/ponto-embarque/:pontoEmbarqueId", authorize(["administrador"]), (req, res) => pontoEmbarqueController.getPontoEmbarqueByPk(req, res));
pontoEmbarqueRouter.post("/ponto-embarque", authorize(["administrador"]), (req, res) => pontoEmbarqueController.createPontoEmbarque(req, res));
pontoEmbarqueRouter.put("/ponto-embarque/:pontoEmbarqueId", authorize(["administrador"]), (req, res) => pontoEmbarqueController.updatePontoEmbarque(req, res));
pontoEmbarqueRouter.delete("/ponto-embarque/:pontoEmbarqueId", authorize(["administrador"]), (req, res) => pontoEmbarqueController.deletePontoEmbarque(req, res));

export default pontoEmbarqueRouter;