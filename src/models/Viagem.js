import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import * as yup from "yup";

class Viagem extends Model {
  static associate(models) {
    this.belongsTo(models.StatusViagem, { foreignKey: "StatusViagemId" });
    this.belongsTo(models.Administrador, { foreignKey: "AdministradorId" });
    this.belongsTo(models.Carro, { foreignKey: "CarroId" });
    this.belongsTo(models.Motorista, {
      foreignKey: "MotoristaId",
      as: "Motorista",
    }); //deixar o AS setado
    this.belongsToMany(models.Passageiro, {
      through: "PassageiroViagem",
      foreignKey: "ViagemId",
      otherKey: "PassageiroId",
      as: "Passageiros",
    });
    this.belongsTo(models.Inquilino, { foreignKey: "InquilinoId" });
    this.belongsTo(models.Setor, { foreignKey: "SetorId" });
  }

  static async addPassageiros(passageiros, viagem) {
    return await Promise.all(
      passageiros.map((p) =>
        viagem.addPassageiro(p.PassageiroId, {
          through: {
            MotivoViagem: p.MotivoViagem,
            PontoEmbarqueId: p.PontoEmbarqueId,
            AcompanhanteId: p.AcompanhanteId,
            InquilinoId: p.InquilinoId,
          },
        })
      )
    );
  }

  static async removePassageiros(passageiros, viagem) {
    return await Promise.all(
      passageiros.map(p => viagem.removePassageiro(p))
    );
  }

  static validateViagem(viagem) {
    const schema = yup.object().shape({
      DataHora: yup.date().required(),
      CidadeDestino: yup.string().max(255).required(),
      TarefasExtras: yup.string(),
      CarroId: yup.number().integer().positive().required(),
      AdministradorId: yup.number().integer().positive().required(),
      MotoristaId: yup.number().integer().positive().required(),
      SetorId: yup.number().integer().positive().required(),
      InquilinoId: yup.number().integer().positive().required(),
      Passageiros: yup.array().required(),
    });

    return schema.validateSync(viagem);
  }
}

Viagem.init(
  {
    ViagemId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    DataHora: { type: DataTypes.DATE, allowNull: false },
    CidadeDestino: { type: DataTypes.STRING, allowNull: false },
    TarefasExtras: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "Viagem",
    tableName: "Viagem",
    timestamps: true,
  }
);

export default Viagem;
