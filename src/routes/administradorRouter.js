import express from "express";
const administradorRouter = express.Router();
import authorize from "../middlewares/authorize.js";
import administradorController from "../controllers/administradorController.js";

administradorRouter.get("/administrador", authorize(["administrador"]), (req, res) => administradorController.getAdministradores(req, res));
administradorRouter.get("/administrador/inativos", authorize(["administrador"]), (req, res) => administradorController.getAdministradoresInativos(req, res));
administradorRouter.get("/administrador/:administradorId", authorize(["administrador"]), (req, res) => administradorController.getAdministradorByPk(req, res));
administradorRouter.post("/administrador", authorize(["administrador"]), (req, res) => administradorController.createAdministrador(req, res));
administradorRouter.put("/administrador/:administradorId", authorize(["administrador"]), (req, res) => administradorController.updateAdministrador(req, res));
administradorRouter.put("/administrador/inativar/:administradorId", authorize(["administrador"]), (req, res) => administradorController.inactivateAdministrador(req, res));
administradorRouter.put("/administrador/ativar/:administradorId", authorize(["administrador"]), (req, res) => administradorController.activateAdministrador(req, res));
administradorRouter.delete("/administrador/:administradorId", authorize(["administrador"]), (req, res) => administradorController.deleteAdministrador(req, res));

export default administradorRouter;