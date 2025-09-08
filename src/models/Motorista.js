import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import Endereco from "./Endereco.js";
import * as yup from "yup";
import validarCPF from "../utils/cpfValidator.js";
import bcrypt from "bcrypt";

class Motorista extends Model {
  static associate(models) {
    this.hasMany(models.Viagem, { foreignKey: "MotoristaId", as: "Viagens" });
    this.belongsTo(models.Inquilino, { foreignKey: "InquilinoId" });
    this.belongsTo(models.Setor, { foreignKey: "SetorId" });
  }

  async getEndereco() {
    return await Endereco.findOne({
      where: { referenciaId: this.MotoristaId, referenciaTipo: "Motorista" },
    });
  }

  static gerarHashSenha(senhaDigitada) {
    const saltRounds = 10;
    return bcrypt.hashSync(senhaDigitada, saltRounds);
  }

  static comparaSenha(senhaDigitada, senhaHash) {
    const result = bcrypt.compareSync(senhaDigitada, senhaHash);

    return result;
  }

  static validateMotorista(motorista) {
    const schema = yup.object().shape({
      Nome: yup.string().max(255).required(),
      Telefone: yup.string().required(),
      CPF: yup
        .string()
        .length(11)
        .required()
        .test("CPF inválido", "CPF válido", (value) => validarCPF(value)),
      Email: yup.string().max(255).email("Email inválido").required(),
      Senha: yup.string().max(255).required(),
      CNH: yup.string().max(20).required(),
      CategoriaCNH: yup.string().max(20).required(),
      Ativo: yup.bool(),
      SetorId: yup.number().integer().positive().required(),
      InquilinoId: yup.number().integer().positive().required(),
    });

    return schema.validateSync(motorista);
  }
}

Motorista.init(
  {
    MotoristaId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nome: { type: DataTypes.STRING, allowNull: false },
    Telefone: { type: DataTypes.STRING, allowNull: false },
    CPF: { type: DataTypes.STRING, allowNull: false },
    Email: { type: DataTypes.STRING, allowNull: false },
    Senha: { type: DataTypes.STRING, allowNull: false },
    CNH: { type: DataTypes.STRING, allowNull: false, unique: true },
    CategoriaCNH: { type: DataTypes.STRING, allowNull: false },
    Ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    modelName: "Motorista",
    tableName: "Motorista",
    timestamps: false,
  }
);

export default Motorista;
