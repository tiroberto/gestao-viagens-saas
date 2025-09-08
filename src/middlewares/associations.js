import Motorista from "../models/Motorista.js";
import Viagem from "../models/Viagem.js";
import Passageiro from "../models/Passageiro.js";
import PassageiroViagem from "../models/PassageiroViagem.js";
import Acompanhante from "../models/Acompanhante.js";
import Administrador from "../models/Administrador.js";
import Carro from "../models/Carro.js";
import Endereco from "../models/Endereco.js";
import Local from "../models/Local.js";
import LogSistema from "../models/LogSistema.js";
import PontoEmbarque from "../models/PontoEmbarque.js";
import StatusViagem from "../models/StatusViagem.js";
import Setor from "../models/Setor.js";
import Inquilino from "../models/Inquilino.js";
import sequelize from "../config/db.js";


const models = { 
  Motorista, 
  Viagem, 
  Passageiro, 
  PassageiroViagem,
  Acompanhante,
  Administrador,
  Carro,
  Endereco,
  Local,
  LogSistema,
  PontoEmbarque,
  StatusViagem,
  Setor,
  Inquilino,
};

// Chama os métodos associate de cada model
export default function associateEntidades(){
  Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models);
    }
//    console.log("Teste");
  });
  return;
}

