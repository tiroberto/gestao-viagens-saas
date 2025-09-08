import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import * as yup from "yup";

class Setor extends Model {
  static associate(models) {
    this.belongsTo(models.Administrador, {foreignKey: "AdministradorId",});
    this.hasMany(models.Carro, { foreignKey: "SetorId" });
    this.hasMany(models.Viagem, { foreignKey: "SetorId" });
    this.hasMany(models.Motorista, { foreignKey: "SetorId" });
    this.belongsTo(models.Inquilino, { foreignKey: "InquilinoId" });
  }

  static validateSetor(setor) {
    const schema = yup.object().shape({
      Nome: yup.string().max(255).required(),
      AdministradorId: yup.number().integer().positive().required(),
      Ativo: yup.bool(),
      InquilinoId: yup.number().integer().positive().required(),
    });

    return schema.validateSync(setor);
  }
}

Setor.init(
  {
    SetorId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nome: { type: DataTypes.STRING, allowNull: false },
    Ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    modelName: "Setor",
    tableName: "Setor",
    timestamps: false,
  }
);

export default Setor;
