import Setor from "../models/Setor.js";
import SetorDTO from "../models/dto/SetorDTO.js";
import Inquilino from "../models/Inquilino.js";
import LogSistema from "../models/LogSistema.js";
import Administrador from "../models/Administrador.js";
import { Op } from "sequelize";

class setorController {
  async getSetor(req, res) {
    try {
      const { inquilinoId, adminId } = req.query;

      if (adminId) {
        let pontoEmbarque = await Setor.findOne({
          where: {
            InquilinoId: inquilinoId,
            AdministradorId: adminId,
          },
          include: [{ model: Inquilino }, { model: Administrador }],
        });
        
        if (pontoEmbarque) {
          pontoEmbarque = SetorDTO.fromEntity(pontoEmbarque);
          return res.json(pontoEmbarque);
        } else res.status(400).json({ error: "Locais não encontrados" });
      } else {
        let pontosEmbarqueExists = await Setor.findAll({
          where: {
            InquilinoId: inquilinoId,
            Ativo: true,
          },
          include: [{ model: Inquilino }],
        });

        if (pontosEmbarqueExists.length > 0) {
          let pontosEmbarque = pontosEmbarqueExists.map((setor) => SetorDTO.fromEntity(setor));
          return res.json(pontosEmbarque);
        } else res.status(400).json({ error: "Setors não encontrados" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSetorByPk(req, res) {
    try {
      const { setorId } = req.params;
      let setor = await Setor.findByPk(setorId, {
        include: [{ model: Inquilino }, { model: Administrador }],
      });
      if (!setor) return res.status(400).json({ error: "Setor não existe" });

      return res.json(SetorDTO.fromEntity(setor));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createSetor(req, res) {
    try {
      const setorEntidade = SetorDTO.toEntity(req.body);

      if (Setor.validateSetor(setorEntidade)) {
        let setor = await Setor.create(setorEntidade);

        if (setor.SetorId > 0)
          return res.json(setor);
        else
          return res.status(400).json({ erro: "Erro ao criar setor" });
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

  async updateSetor(req, res) {
    try {
      const setorEntidade = SetorDTO.toEntity(req.body);

      if (Setor.validateSetor(setorEntidade)) {
        const { setorId } = req.params;
        const { adminId } = req.query;

        let setorExists = await Setor.findByPk(setorId, {
          include: [{ model: Inquilino }, { model: Administrador }],
        });

        if (!setorExists)
          return res.res.status(400).json({ erro: "Setor não existe" });

        await Setor.update(setorEntidade, {
          where: { SetorId: setorId },
        });

        let setorUpdated = await Setor.findByPk(setorId, {
          include: [{ model: Inquilino }, { model: Administrador }],
        });

        setorExists = SetorDTO.fromEntity(setorExists.get({ plain: true }));
        setorUpdated = SetorDTO.fromEntity(setorUpdated.get({ plain: true }));

        await LogSistema.setLogSistema(
          SetorDTO.toEntity(setorExists),
          SetorDTO.toEntity(setorUpdated),
          adminId,
          { ReferenciaId: setorId, ReferenciaTipo: "Setor" }
        );

        return res.json(setorUpdated);
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

  async deleteSetor(req, res) {
    try {
      const { setorId } = req.params;
      const { adminId } = req.query;

      let setorExists = await Setor.findByPk(setorId, {
        include: [{ model: Inquilino }, { model: Administrador }],
      });

      if (!setorExists)
        return res.status(400).json({ erro: "Setor não existe" });

      setorExists = SetorDTO.fromEntity(setorExists);

      await Setor.destroy({
        where: {
          SetorId: setorId,
        },
      })
        .then((data) => console.log("Setor excluído"))
        .catch((err) => console.log(err));

      await LogSistema.setDeleteLog(setorExists, adminId, {
        ReferenciaId: setorId,
        ReferenciaTipo: "Setor",
      });

      return res.send("Excluído");
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new setorController();
