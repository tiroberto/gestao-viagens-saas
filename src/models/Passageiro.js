import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import * as yup from "yup";
import validarCPF from "../utils/cpfValidator.js";

class Passageiro extends Model {
  static associate(models) {
    this.belongsToMany(models.Viagem, {
      through: "PassageiroViagem",
      foreignKey: "PassageiroId",
      otherKey: "ViagemId",
      as: "Viagens",
    });
    this.belongsTo(models.Inquilino, { foreignKey: "InquilinoId" });
  }

  async getEndereco() {
    return await Endereco.findOne({
      where: { referenciaId: this.PassageiroId, referenciaTipo: "Passageiro" },
    });
  }

  async setEndereco(endereco) {
    return await Endereco.create({
      ...endereco,
      referenciaId: this.PassageiroId,
      referenciaTipo: "Passageiro",
    });
  }

  static validatePassageiro(passageiro) {
    const schema = yup.object().shape({
      Nome: yup.string().min(3).max(255).required("Nome é obrigatório"),
      Telefone: yup.string().required("Telefone é obrigatório"),
      CPF: yup
        .string()
        .length(11)
        .required("CPF é obrigatório")
        .test("CPF válido", "CPF inválido", (value) => validarCPF(value || "")),
      Ativo: yup.bool(),
      InquilinoId: yup.number().integer().positive().required(),
    });

    return schema.validateSync(passageiro);
  }
}

Passageiro.init(
  {
    PassageiroId: {
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
    modelName: "Passageiro",
    tableName: "Passageiro",
    timestamps: false,
  }
);

export default Passageiro;
