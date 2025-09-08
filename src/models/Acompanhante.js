import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import * as yup from "yup";
import validarCPF from "../utils/cpfValidator.js";

class Acompanhante extends Model {
  static associate(models) {
    this.hasMany(models.PassageiroViagem, {
      foreignKey: "AcompanhanteId",
      as: "Viagens",
    });
    this.belongsTo(models.Inquilino, { foreignKey: "InquilinoId" });
  }

  static validateAcompanhante(acompanhante) {
    const schema = yup.object().shape({
      Nome: yup.string().max(255).required(),
      Telefone: yup.string().required(),
      CPF: yup
        .string()
        .length(11)
        .required()
        .test("CPF inválido", "CPF válido", (value) => validarCPF(value)),
      Ativo: yup.bool(),
      InquilinoId: yup.number().integer().required(),
    });

    return schema.validateSync(acompanhante);
  }
}

Acompanhante.init(
  {
    AcompanhanteId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nome: { type: DataTypes.STRING, allowNull: false },
    Telefone: { type: DataTypes.STRING, allowNull: false },
    CPF: { type: DataTypes.STRING, allowNull: false },
    Ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    modelName: "Acompanhante",
    tableName: "Acompanhante",
    timestamps: false,
  }
);

export default Acompanhante;
