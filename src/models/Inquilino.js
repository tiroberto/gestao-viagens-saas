import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class Inquilino extends Model {
  static associate(models) {
    this.hasMany(models.PassageiroViagem, { foreignKey: "InquilinoId" });
    this.hasMany(models.Acompanhante, { foreignKey: "InquilinoId" });
    this.hasMany(models.Administrador, { foreignKey: "InquilinoId" });
    this.hasMany(models.Carro, { foreignKey: "InquilinoId" });
    this.hasMany(models.Endereco, { foreignKey: "InquilinoId" });
    this.hasMany(models.Local, { foreignKey: "InquilinoId" });
    this.hasMany(models.LogSistema, { foreignKey: "InquilinoId" });
    this.hasMany(models.Motorista, { foreignKey: "InquilinoId" });
    this.hasMany(models.Passageiro, { foreignKey: "InquilinoId" });
    this.hasMany(models.PontoEmbarque, { foreignKey: "InquilinoId" });
    this.hasMany(models.Viagem, { foreignKey: "InquilinoId" });
  }
}

Inquilino.init(
  {
    InquilinoId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nome: { type: DataTypes.STRING, allowNull: false },
    CNPJ: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "Inquilino",
    tableName: "Inquilino",
    timestamps: false,
  }
);

export default Inquilino;
