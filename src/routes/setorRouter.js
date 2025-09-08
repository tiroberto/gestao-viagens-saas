import express from "express";
const setorRouter = express.Router();
import authorize from "../middlewares/authorize.js";
import setorController from "../controllers/setorController.js";

setorRouter.get("/setor", authorize(["administrador"]), (req, res) => setorController.getSetor(req, res));
setorRouter.get("/setor/:setorId", authorize(["administrador"]), (req, res) => setorController.getSetorByPk(req, res));
setorRouter.post("/setor", authorize(["administrador"]), (req, res) => setorController.createSetor(req, res));
setorRouter.put("/setor/:setorId", authorize(["administrador"]), (req, res) => setorController.updateSetor(req, res));
setorRouter.delete("/setor/:setorId", authorize(["administrador"]), (req, res) => setorController.deleteSetor(req, res));

export default setorRouter;