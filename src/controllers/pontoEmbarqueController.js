import PontoEmbarque from "../models/PontoEmbarque.js";
import PontoEmbarqueDTO from "../models/dto/PontoEmbarqueDTO.js";
import Inquilino from "../models/Inquilino.js";
import LogSistema from "../models/LogSistema.js";
import Endereco from "../models/Endereco.js";
import { Op } from "sequelize";

class pontoEmbarqueController {
  async getPontoEmbarque(req, res) {
    try {
      const { inquilinoId, cidade } = req.query;

      if (cidade) {
        let pontosEmbarque = await PontoEmbarque.findAll({
          where: {
            Cidade: {
              [Op.substring]: cidade,
            },
          }
        });
        
        if (pontosEmbarque.length > 0) {
          pontosEmbarque = pontosEmbarque.map(p => PontoEmbarqueDTO.fromEntity(p));
          return res.json(pontosEmbarque);
        } else res.status(400).json({ error: "Locais não encontrados" });
      } else {
        let pontosEmbarqueExists = await PontoEmbarque.findAll({
          where: {
            InquilinoId: inquilinoId,
            Ativo: true,
          },
          include: [{ model: Inquilino }],
        });

        if (pontosEmbarqueExists.length > 0) {
          let pontosEmbarque = pontosEmbarqueExists.map((pontoEmbarque) => PontoEmbarqueDTO.fromEntity(pontoEmbarque));
          return res.json(pontosEmbarque);
        } else res.status(400).json({ error: "PontoEmbarques não encontrados" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPontoEmbarqueByPk(req, res) {
    try {
      const { pontoEmbarqueId } = req.params;
      let pontoEmbarque = await PontoEmbarque.findByPk(pontoEmbarqueId, {
        include: [{ model: Inquilino }],
      });
      if (!pontoEmbarque) return res.status(400).json({ error: "Ponto de embarque não existe" });

      return res.json(PontoEmbarqueDTO.fromEntity(pontoEmbarque));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createPontoEmbarque(req, res) {
    try {
      const pontoEmbarqueEntidade = PontoEmbarqueDTO.toEntity(req.body);

      if (PontoEmbarque.validatePontoEmbarque(pontoEmbarqueEntidade)) {
        let pontoEmbarque = await PontoEmbarque.create(pontoEmbarqueEntidade);

        if (pontoEmbarque.PontoEmbarqueId > 0)
          return res.json(pontoEmbarque);
        else
          return res.status(400).json({ erro: "Erro ao criar ponto de embarque" });
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

  async updatePontoEmbarque(req, res) {
    try {
      const pontoEmbarqueEntidade = PontoEmbarqueDTO.toEntity(req.body);

      if (PontoEmbarque.validatePontoEmbarque(pontoEmbarqueEntidade)) {
        const { pontoEmbarqueId } = req.params;
        const { adminId } = req.query;

        let pontoEmbarqueExists = await PontoEmbarque.findByPk(pontoEmbarqueId, {
          include: [{ model: Inquilino }],
        });

        if (!pontoEmbarqueExists)
          return res.res.status(400).json({ erro: "Ponto de embarque não existe" });

        await PontoEmbarque.update(pontoEmbarqueEntidade, {
          where: { PontoEmbarqueId: pontoEmbarqueId },
        });

        let pontoEmbarqueUpdated = await PontoEmbarque.findByPk(pontoEmbarqueId, {
          include: [{ model: Inquilino }],
        });

        pontoEmbarqueExists = PontoEmbarqueDTO.fromEntity(pontoEmbarqueExists.get({ plain: true }));
        pontoEmbarqueUpdated = PontoEmbarqueDTO.fromEntity(pontoEmbarqueUpdated.get({ plain: true }));

        await LogSistema.setLogSistema(
          PontoEmbarqueDTO.toEntity(pontoEmbarqueExists),
          PontoEmbarqueDTO.toEntity(pontoEmbarqueUpdated),
          adminId,
          { ReferenciaId: pontoEmbarqueId, ReferenciaTipo: "PontoEmbarque" }
        );

        return res.json(pontoEmbarqueUpdated);
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

  async deletePontoEmbarque(req, res) {
    try {
      const { pontoEmbarqueId } = req.params;
      const { adminId } = req.query;

      let pontoEmbarqueExists = await PontoEmbarque.findByPk(pontoEmbarqueId, {
        include: [{ model: Inquilino }],
      });

      if (!pontoEmbarqueExists)
        return res.status(400).json({ erro: "Ponto de embarque não existe" });

      pontoEmbarqueExists = PontoEmbarqueDTO.fromEntity(pontoEmbarqueExists);

      await PontoEmbarque.destroy({
        where: {
          PontoEmbarqueId: pontoEmbarqueId,
        },
      })
        .then((data) => console.log("Ponto de embarque excluído"))
        .catch((err) => console.log(err));

      await LogSistema.setDeleteLog(pontoEmbarqueExists, adminId, {
        ReferenciaId: pontoEmbarqueId,
        ReferenciaTipo: "PontoEmbarque",
      });

      return res.send("Excluído");
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new pontoEmbarqueController();
