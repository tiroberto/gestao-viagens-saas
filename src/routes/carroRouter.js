import express from "express";
const carroRouter = express.Router();
import authorize from "../middlewares/authorize.js";
import carroController from "../controllers/carroController.js";

carroRouter.get("/carro", authorize(["administrador"]), (req, res) => carroController.getCarros(req, res));
carroRouter.get("/carro/inativos", authorize(["administrador"]), (req, res) => carroController.getCarrosInativos(req, res));
carroRouter.get("/carro/:carroId", authorize(["administrador"]), (req, res) => carroController.getCarroByPk(req, res));
carroRouter.post("/carro", authorize(["administrador"]), (req, res) => carroController.createCarro(req, res));
carroRouter.put("/carro/:carroId", authorize(["administrador"]), (req, res) => carroController.updateCarro(req, res));
carroRouter.put("/carro/inativar/:carroId", authorize(["administrador"]), (req, res) => carroController.inactivateCarro(req, res));
carroRouter.put("/carro/ativar/:carroId", authorize(["administrador"]), (req, res) => carroController.activateCarro(req, res));
carroRouter.delete("/carro/:carroId", authorize(["administrador"]), (req, res) => carroController.deleteCarro(req, res));

export default carroRouter;