import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import * as yup from "yup";

class StatusViagem extends Model {
  static associate(models) {
    this.hasMany(models.Viagem, { foreignKey: "StatusViagemId" });
  }

  static validateStatusViagem(statusViagem) {
    const schema = yup.object().shape({
      Descricao: yup.string().required(),
    });

    return schema.validateSync(statusViagem);
  }
}

StatusViagem.init(
  {
    StatusViagemId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Descricao: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "StatusViagem",
    tableName: "StatusViagem",
    timestamps: false,
  }
);

export default StatusViagem;
