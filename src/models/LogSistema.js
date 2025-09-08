import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import PassageiroViagemDTO from "./dto/PassageiroViagemDTO.js";

class LogSistema extends Model {
  static associate(models) {
    this.belongsTo(models.Administrador, {
      foreignKey: "AdministradorId",
    });
    this.belongsTo(models.Inquilino, { foreignKey: "InquilinoId" });
  }

  static validateLogSistema(logSistema) {
    const schema = yup.object().shape({
      CampoAlterado: yup.string().max(255).required(),
      ValorAntigo: yup.string().max(255).required(),
      ValorNovo: yup.string().max(255).required(),
      Referencia: yup
        .object({
          ReferenciaId: yup.number().integer().positive().required(),
          ReferenciaTipo: yup.string().required(),
        })
        .required(),
      Administrador: yup
        .object({
          AdministradorId: yup.number().integer().positive().required(),
          Nome: yup.string(),
        })
        .required(),
      Inquilino: yup
        .object({
          InquilinoId: yup.number().integer().positive().required(),
          Nome: yup.string(),
        })
        .required(),
    });

    schema
      .validate(logSistema)
      .then((data) => {
        console.log("Validação ok");
        return true;
      })
      .catch((error) => {
        console.log(error.message);
        return false;
      });
  }

  static async setDeleteLog(entidadeDeletada, adminId, referencia){
    if (referencia.ReferenciaTipo == "Viagem")
      entidadeDeletada.Passageiros = JSON.stringify(entidadeDeletada.Passageiros);
    
    let log = {
      CampoAlterado: "Entidade deletada",
      ValorAntigo: JSON.stringify(entidadeDeletada),
      ValorNovo: " ",
      AdministradorId: adminId,
      ReferenciaId: referencia.ReferenciaId,
      ReferenciaTipo: referencia.ReferenciaTipo,
      InquilinoId: entidadeDeletada.Inquilino.InquilinoId,
    };
    await LogSistema.create(log);
  }

  static async setLogSistema(antes, depois, adminId, referencia) {
    if (referencia.ReferenciaTipo == "Viagem") {
      antes.Passageiros = JSON.stringify(antes.Passageiros);
      depois.Passageiros = JSON.stringify(depois.Passageiros);
    }

    const changes = [];
    const campos = Object.keys(antes);
    const oldValues = Object.values(antes);
    const newValues = Object.values(depois);
    //console.log(antes, depois);
    for (var i = 0; i < campos.length; i++) {
      let isDifferent = false;
      if (oldValues[i] instanceof Date && newValues[i] instanceof Date) {
        let antigoCheck = new Date(
          oldValues[i].getFullYear(),
          oldValues[i].getMonth(),
          oldValues[i].getDate(),
          oldValues[i].getHours()
        );
        let novoCheck = new Date(
          newValues[i].getFullYear(),
          newValues[i].getMonth(),
          newValues[i].getDate(),
          newValues[i].getHours()
        );

        isDifferent = antigoCheck.getTime() !== novoCheck.getTime();          
      } else {
        isDifferent = oldValues[i] != newValues[i];
      }

      if (isDifferent) {
        changes.push({
          CampoAlterado: campos[i],
          ValorAntigo: oldValues[i] != null ? String(oldValues[i]) : "",
          ValorNovo: newValues[i] != null ? String(newValues[i]) : "",
          AdministradorId: adminId, 
          ReferenciaId: parseInt(referencia.ReferenciaId),
          ReferenciaTipo: referencia.ReferenciaTipo,
          InquilinoId: antes.InquilinoId,
        });
      }
    }
    //console.log(changes);

    return await LogSistema.bulkCreate(changes);
  }
}

LogSistema.init(
  {
    LogSistemaId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CampoAlterado: { type: DataTypes.STRING, allowNull: false },
    ValorAntigo: { type: DataTypes.STRING, allowNull: false },
    ValorNovo: { type: DataTypes.STRING, allowNull: false },
    ReferenciaId: { type: DataTypes.INTEGER, allowNull: false },
    ReferenciaTipo: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    modelName: "LogSistema",
    tableName: "LogSistema",
    timestamps: true,
  }
);

export default LogSistema;
