import express from "express";
const passageiroRouter = express.Router();
import authorize from "../middlewares/authorize.js";
import passageiroController from "../controllers/passageiroController.js";

passageiroRouter.get("/passageiro", authorize(["administrador"]), (req, res) => passageiroController.getPassageiros(req, res));
passageiroRouter.get("/passageiro/inativos", authorize(["administrador"]), (req, res) => passageiroController.getPassageirosInativos(req, res));
passageiroRouter.get("/passageiro/:passageiroId", authorize(["administrador"]), (req, res) => passageiroController.getPassageiroByPk(req, res));
passageiroRouter.post("/passageiro", authorize(["administrador"]), (req, res) => passageiroController.createPassageiro(req, res));
passageiroRouter.put("/passageiro/:passageiroId", authorize(["administrador"]), (req, res) => passageiroController.updatePassageiro(req, res));
passageiroRouter.put("/passageiro/inativar/:passageiroId", authorize(["administrador"]), (req, res) => passageiroController.inactivatePassageiro(req, res));
passageiroRouter.put("/passageiro/ativar/:passageiroId", authorize(["administrador"]), (req, res) => passageiroController.activatePassageiro(req, res));
passageiroRouter.delete("/passageiro/:passageiroId", authorize(["administrador"]), (req, res) => passageiroController.deletePassageiro(req, res));

export default passageiroRouter;