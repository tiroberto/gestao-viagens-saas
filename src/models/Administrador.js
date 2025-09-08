import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import * as yup from "yup";
import validarCPF from "../utils/cpfValidator.js";
import bcrypt from "bcrypt";

class Administrador extends Model {
  static associate(models) {
    this.hasMany(models.LogSistema, { foreignKey: "AdministradorId", as: "LogsSistema" });
    this.hasMany(models.Viagem, { foreignKey: "AdministradorId", as: "Viagens" });
    this.belongsTo(models.Inquilino, { foreignKey: "InquilinoId" });
    this.hasOne(models.Setor, { foreignKey: "AdministradorId" });
  }

  static gerarHashSenha(senhaDigitada) {
    const saltRounds = 10;
    return bcrypt.hashSync(senhaDigitada, saltRounds);
  }

  static comparaSenha(senhaDigitada, senhaHash) {
    const result = bcrypt.compareSync(senhaDigitada, senhaHash);

    return result;
  }

  static validateAdministrador(administrador) {
    const schema = yup.object().shape({
      Nome: yup.string().max(255).required(),
      CPF: yup
        .string()
        .length(11)
        .required()
        .test("CPF inválido", "CPF válido", (value) => validarCPF(value)),
      Telefone: yup.string().required(),
      Cargo: yup.string().max(255).required(),
      Email: yup.string().max(255).required(),
      Senha: yup.string().max(255).required(),
      Ativo: yup.bool(),
      InquilinoId: yup.number().integer().positive().required(),
    });

    return schema.validateSync(administrador);
  }
}

Administrador.init(
  {
    AdministradorId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nome: { type: DataTypes.STRING, allowNull: false },
    CPF: { type: DataTypes.STRING, allowNull: false },
    Telefone: { type: DataTypes.STRING, allowNull: false },
    Cargo: { type: DataTypes.STRING, allowNull: false },
    Email: { type: DataTypes.STRING, allowNull: false },
    Senha: { type: DataTypes.STRING, allowNull: false },
    Ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    modelName: "Administrador",
    tableName: "Administrador",
    timestamps: false,
  }
);

export default Administrador;
