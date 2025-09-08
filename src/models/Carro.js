import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import * as yup from "yup";

class Carro extends Model {
  static associate(models) {
    this.hasMany(models.Viagem, { foreignKey: "CarroId", as: "Viagens" });
    this.belongsTo(models.Setor, { foreignKey: "SetorId" });
    this.belongsTo(models.Inquilino, { foreignKey: "InquilinoId" });
  }

  static validateCarro(carro) {
    const schema = yup.object().shape({
      Nome: yup.string().max(255).required(),
      Placa: yup.string().max(7).required(),
      TipoCombustivel: yup.string().max(255).required(),
      Ativo: yup.bool(),
      SetorId: yup.number().integer().positive().required(),
      InquilinoId: yup.number().integer().positive().required(),
    });

    return schema.validateSync(carro);
  }
}

Carro.init(
  {
    CarroId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nome: { type: DataTypes.STRING, allowNull: false },
    Placa: { type: DataTypes.STRING, allowNull: false },
    TipoCombustivel: { type: DataTypes.STRING, allowNull: false },
    Ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    modelName: "Carro",
    tableName: "Carro",
    timestamps: false,
  }
);

export default Carro;
