import StatusViagem from "../models/StatusViagem.js";
import StatusViagemDTO from "../models/dto/StatusViagemDTO.js";
import Inquilino from "../models/Inquilino.js";
import LogSistema from "../models/LogSistema.js";
import Administrador from "../models/Administrador.js";
import { Op } from "sequelize";

class statusViagemController {
  async getStatusViagem(req, res) {
    try {
        let statusViagemExists = await StatusViagem.findAll();

        if (statusViagemExists.length > 0) {
          let statusViagem = statusViagemExists.map((statusViagem) => StatusViagemDTO.fromEntity(statusViagem));
          return res.json(statusViagem);
        } else res.status(400).json({ error: "Status de viagems não encontrados" });
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStatusViagemByPk(req, res) {
    try {
      const { statusViagemId } = req.params;
      let statusViagem = await StatusViagem.findByPk(statusViagemId);

      if (!statusViagem) return res.status(400).json({ error: "Status de viagem não existe" });

      return res.json(StatusViagemDTO.fromEntity(statusViagem));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createStatusViagem(req, res) {
    try {
      const statusViagemEntidade = StatusViagemDTO.toEntity(req.body);

      if (StatusViagem.validateStatusViagem(statusViagemEntidade)) {
        let statusViagem = await StatusViagem.create(statusViagemEntidade);

        if (statusViagem.StatusViagemId > 0)
          return res.json(statusViagem);
        else
          return res.status(400).json({ erro: "Erro ao criar statusViagem" });
      } else return res.status(400).json({ erro: "Erro na validação" });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          errors: error.errors, // lista de mensagens de erro
        });
      }
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateStatusViagem(req, res) {
    try {
      const statusViagemEntidade = StatusViagemDTO.toEntity(req.body);

      if (StatusViagem.validateStatusViagem(statusViagemEntidade)) {
        const { statusViagemId } = req.params;
        const { adminId } = req.query;

        let statusViagemExists = await StatusViagem.findByPk(statusViagemId);

        if (!statusViagemExists)
          return res.res.status(400).json({ erro: "Status de viagem não existe" });

        await StatusViagem.update(statusViagemEntidade, {
          where: { StatusViagemId: statusViagemId },
        });

        let statusViagemUpdated = await StatusViagem.findByPk(statusViagemId);

        statusViagemUpdated = StatusViagemDTO.fromEntity(statusViagemUpdated);
        return res.json(statusViagemUpdated);
      } else return res.status(400).json({ erro: "Erro na validação " });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          errors: error.errors, // lista de mensagens de erro
        });
      }
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteStatusViagem(req, res) {
    try {
      const { statusViagemId } = req.params;
      const { adminId } = req.query;

      let statusViagemExists = await StatusViagem.findByPk(statusViagemId, {
        include: [{ model: Inquilino }, { model: Administrador }],
      });

      if (!statusViagemExists)
        return res.status(400).json({ erro: "StatusViagem não existe" });

      statusViagemExists = StatusViagemDTO.fromEntity(statusViagemExists);

      await StatusViagem.destroy({
        where: {
          StatusViagemId: statusViagemId,
        },
      })
        .then((data) => console.log("StatusViagem excluído"))
        .catch((err) => console.log(err));

      await LogSistema.setDeleteLog(statusViagemExists, adminId, {
        ReferenciaId: statusViagemId,
        ReferenciaTipo: "StatusViagem",
      });

      return res.send("Excluído");
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new statusViagemController();
