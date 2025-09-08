import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import * as yup from "yup";
import Endereco from "./Endereco.js";

class Local extends Model {
  static associate(models) {
    this.belongsTo(models.Inquilino, { foreignKey: "InquilinoId" });
  }

  async getEndereco() {
    this.Endereco = await Endereco.findOne({
      where: { ReferenciaId: this.LocalId, ReferenciaTipo: "Local" },
    });
  }

  async setEndereco(endereco) {
    return await Endereco.create({
      ...endereco,
      ReferenciaId: this.LocalId,
      ReferenciaTipo: "Local",
    });
  }

  static validateEndereco(endereco) {
    const schema = yup.object().shape({
      Logradouro: yup.string().max(255).required(),
      Numero: yup.string().max(255).required(),
      Bairro: yup.string().max(255).required(),
      Cidade: yup.string().max(255).required(),
      EstadoUF: yup.string().max(10).required(),
      CEP: yup.string().max(8).required(),
      Complemento: yup.string().max(255).nullable(),
    });

    return schema.validateSync(endereco);
  }

  static validateLocal(local) {
    const schema = yup.object().shape({
      Descricao: yup.string().max(255).required(),
      Ativo: yup.bool(),
      InquilinoId: yup.number().integer().positive().required(),
    });

    return schema.validateSync(local);
  }
}

Local.init(
  {
    LocalId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Descricao: { type: DataTypes.STRING, allowNull: false },
    Ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    modelName: "Local",
    tableName: "Local",
    timestamps: false,
  }
);

export default Local;
