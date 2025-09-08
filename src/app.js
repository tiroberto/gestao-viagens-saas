import express from "express";
import dotenv from "dotenv";
const app = express();
import sequelize from "../src/config/db.js";
import associateEntidades from "./middlewares/associations.js";
import motoristaRouter from "./routes/motoristaRouter.js";
import passageiroRouter from "./routes/passageiroRouter.js";
import viagemRouter from "./routes/viagemRouter.js";
import acompanhanteRouter from "./routes/acompanhanteRouter.js";
import administradorRouter from "./routes/administradorRouter.js";
import carroRouter from "./routes/carroRouter.js";
import enderecoRouter from "./routes/enderecoRouter.js";
import localRouter from "./routes/localRouter.js";
import logSistemaRouter from "./routes/logSistemaRouter.js";
import pontoEmbarqueRouter from "./routes/pontoEmbarqueRouter.js";
import setorRouter from "./routes/setorRouter.js";
import statusViagemRouter from "./routes/statusViagemRouter.js";
import authRouter from "./routes/authRouter.js";

//configura a secret key
dotenv.config();

//middleware para interpretar json
app.use(express.json());

//criar associações
associateEntidades();

//rotas
app.use(motoristaRouter);
app.use(passageiroRouter);
app.use(viagemRouter);
app.use(acompanhanteRouter);
app.use(administradorRouter);
app.use(carroRouter);
app.use(enderecoRouter);
app.use(localRouter);
app.use(logSistemaRouter);
app.use(pontoEmbarqueRouter);
app.use(setorRouter);
app.use(statusViagemRouter);
app.use(authRouter);

sequelize
  .sync()
  .then(() => console.log("Banco sincronizado"))
  .catch((err) => console.error("Erro ao conectar banco:", err));

export default app;
