import LogSistema from "../models/LogSistema.js";
import LogSistemaDTO from "../models/dto/LogSistemaDTO.js";
import Inquilino from "../models/Inquilino.js";
import Administrador from "../models/Administrador.js";

class logSistemaController {
  async getLogSistemasByReferencia(req, res) {
    try {
      const referencia = req.body;

      if (referencia) {
        let logSistemasExists = await LogSistema.findAll({
          where: {
            InquilinoId: referencia.InquilinoId,
            ReferenciaId: referencia.ReferenciaId,
            ReferenciaTipo: referencia.ReferenciaTipo,
          },
          include: [{ model: Inquilino }, { model: Administrador }],
        });

        if (logSistemasExists.length > 0) {
          let logSistemas = logSistemasExists.map((logSistema) =>
            LogSistemaDTO.fromEntity(logSistema)
          );
          return res.json(logSistemas);
        } else res.status(400).json({ error: "LogSistemas não encontrados" });
      } else res.status(400).json({ error: "Referencia não informada" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getLogSistemaByPk(req, res) {
    try {
      const { logSistemaId } = req.params;
      const logSistema = await LogSistema.findByPk(logSistemaId, {
        include: [{ model: Inquilino }, { model: Administrador }],
      });
      if (!logSistema)
        return res.status(400).json({ error: "LogSistema não existe" });

      return res.json(LogSistemaDTO.fromEntity(logSistema));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new logSistemaController();
