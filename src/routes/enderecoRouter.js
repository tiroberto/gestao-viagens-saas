import express from "express";
const enderecoRouter = express.Router();
import authorize from "../middlewares/authorize.js";
import enderecoController from "../controllers/enderecoController.js";

enderecoRouter.get("/endereco", authorize(["administrador"]), (req, res) => enderecoController.getEnderecosByReferencia(req, res));
enderecoRouter.get("/endereco/:enderecoId", authorize(["administrador"]), (req, res) => enderecoController.getEnderecoByPk(req, res));
enderecoRouter.post("/endereco", authorize(["administrador"]), (req, res) => enderecoController.createEndereco(req, res));
enderecoRouter.put("/endereco/:enderecoId", authorize(["administrador"]), (req, res) => enderecoController.updateEndereco(req, res));
enderecoRouter.delete("/endereco/:enderecoId", authorize(["administrador"]), (req, res) => enderecoController.deleteEndereco(req, res));

export default enderecoRouter;