import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import * as yup from "yup";

class PontoEmbarque extends Model {
  static associate(models) {
    this.hasMany(models.PassageiroViagem, { foreignKey: "PontoEmbarqueId" });
    this.belongsTo(models.Inquilino, { foreignKey: "InquilinoId" });
  }

  static validatePontoEmbarque(pontoEmbarque) {
    const schema = yup.object().shape({
      Descricao: yup.string().required(),
      Cidade: yup.string().max(255).required(),
      Ativo: yup.bool(),
      InquilinoId: yup.number().integer().positive().required(),
    });

    return schema.validateSync(pontoEmbarque);
  }
}

PontoEmbarque.init(
  {
    PontoEmbarqueId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Descricao: { type: DataTypes.STRING, allowNull: false },
    Cidade: { type: DataTypes.STRING, allowNull: false },
    Ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    modelName: "PontoEmbarque",
    tableName: "PontoEmbarque",
    timestamps: false,
  }
);

export default PontoEmbarque;
