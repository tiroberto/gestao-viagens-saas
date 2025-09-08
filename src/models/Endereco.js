import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import * as yup from "yup";

class Endereco extends Model {
  static associate(models) {
    this.belongsTo(models.Inquilino, { foreignKey: "InquilinoId" });
  }
  static async getEndereco(referencia){
    return await Endereco.findOne({
      where:{
        ReferenciaId: referencia.ReferenciaId,
        ReferenciaTipo: referencia.ReferenciaTipo,
      }});
  }

  static validateEndereco (endereco){
    const schema = yup.object().shape({
      Logradouro: yup.string().max(255).required(),
      Numero: yup.string().max(255).required(),
      Bairro: yup.string().max(255).required(),
      Cidade: yup.string().max(255).required(),
      CEP: yup.string().max(8).required(),
      Complemento: yup.string().max(255).nullable(),
      EstadoUF: yup.string().max(10).required(),
      ReferenciaId: yup.number().integer().positive().required(),
      ReferenciaTipo: yup.string().max(255).required(),
      InquilinoId: yup.number().integer().positive().required(),
    });

    return schema.validateSync(endereco);
  }
}

Endereco.init(
  {
    EnderecoId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Logradouro: { type: DataTypes.STRING, allowNull: false },
    Numero: { type: DataTypes.STRING, allowNull: false },
    Bairro: { type: DataTypes.STRING, allowNull: false },
    Cidade: { type: DataTypes.STRING, allowNull: false },
    EstadoUF: { type: DataTypes.STRING, allowNull: false },
    CEP: { type: DataTypes.STRING, allowNull: false },
    Complemento: { type: DataTypes.STRING, allowNull: true },
    ReferenciaId: { type: DataTypes.INTEGER, allowNull: false }, // id do motorista, paciente, local
    ReferenciaTipo: { type: DataTypes.STRING, allowNull: false }, // "motorista", "paciente", "local"
  },
  {
    sequelize,
    modelName: "Endereco",
    tableName: "Endereco",
    timestamps: false,
  }
);

export default Endereco;
