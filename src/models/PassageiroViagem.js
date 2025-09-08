import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import * as yup from "yup";
import PassageiroViagemDTO from "./dto/PassageiroViagemDTO.js";
import Viagem from "./Viagem.js";
import Passageiro from "./Passageiro.js";
import Inquilino from "./Inquilino.js";
import Acompanhante from "./Acompanhante.js";
import PontoEmbarque from "./PontoEmbarque.js";

class PassageiroViagem extends Model {
  static associate(models) {
    this.belongsTo(models.Passageiro, {
      foreignKey: "PassageiroId",
    });
    this.belongsTo(models.Viagem, {
      foreignKey: "ViagemId",
    });
    this.belongsTo(models.PontoEmbarque, {
      foreignKey: "PontoEmbarqueId",
    });
    this.belongsTo(models.Acompanhante, {
      foreignKey: "AcompanhanteId",
    });
    this.belongsTo(models.Inquilino, { foreignKey: "InquilinoId" });
  }

  static validatePassageiroViagem(passageiroViagem) {
    const schema = yup.object.shape({
      ViagemId: yup.number().integer().required(),
      PassageiroId: yup.number().integer().required(),
      MotivoViagem: yup.string().required(),
      PontoEmbarque: yup
        .object({
          PontoEmbarqueId: yup.number().integer().required(),
          Descricao: yup.string(),
        })
        .required(),
      Acompanhante: yup.object({
        AcompanhanteId: yup.number().integer().required(),
        Nome: yup.string(),
      }),
      Inquilino: yup
        .object({
          InquilinoId: yup.number().integer().positive().required(),
          Nome: yup.string(),
        })
        .required(),
    });

    schema
      .validate(passageiroViagem)
      .then((data) => {
        console.log("Validação ok");
        return true;
      })
      .catch((error) => {
        console.log(error.message);
        return false;
      });
  }

 /* static async setPassageiros(viagem, req) {
    let passageiros = [];
    for (let index = 0; index < req.body.Passageiros.length; index++) {
      passageiros.push({
        ViagemId: viagem.ViagemId,
        PassageiroId: req.body.Passageiros[index].Passageiro.PassageiroId,
        MotivoViagemId: req.body.Passageiros[index].MotivoViagem.MotivoViagemId,
        PontoEmbarqueId:
          req.body.Passageiros[index].PontoEmbarque.PontoEmbarqueId,
        AcompanhanteId: req.body.Passageiros[index].Acompanhante.AcompanhanteId,
        InquilinoId: viagem.InquilinoId,
      });
    }
    return await PassageiroViagem.bulkCreate(passageiros);
  }

  static async updatePassageiros(passageirosCadastrado, req) {
    let passageirosNovo = req.body.Passageiros;
    const { viagemId } = req.params;
    let passageiros = passageirosNovo.filter(
      (passageiro) =>
        !passageirosCadastrado.some(
          (passageiroCadastrado) =>
            passageiroCadastrado.PassageiroId ==
            passageiro.Passageiro.PassageiroId
        )
    );
    

    for(let i = 0; i<passageiros.length; i++){
      passageiros[i].Viagem = { ViagemId: parseInt(viagemId) };
      passageiros[i] = PassageiroViagemDTO.toEntity(passageiros[i]);
    }
    
    await PassageiroViagem.bulkCreate(passageiros);

    return await PassageiroViagem.findAll({ where: { ViagemId: viagemId } });
  }*/
}

PassageiroViagem.init(
  {
    ViagemId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Viagem",
        key: "ViagemId",
      },
    },
    PassageiroId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Passageiro",
        key: "PassageiroId",
      },
    },
    MotivoViagem: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PontoEmbarqueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "PontoEmbarque",
        key: "PontoEmbarqueId",
      },
    },
    AcompanhanteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Acompanhante",
        key: "AcompanhanteId",
      },
    },
    InquilinoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Inquilino",
        key: "InquilinoId",
      },
    },
  },
  {
    sequelize,
    modelName: "PassageiroViagem",
    tableName: "PassageiroViagem",
    timestamps: false,
  }
);

export default PassageiroViagem;
