import Local from "../models/Local.js";
import LocalDTO from "../models/dto/LocalDTO.js";
import Inquilino from "../models/Inquilino.js";
import LogSistema from "../models/LogSistema.js";
import Endereco from "../models/Endereco.js";
import { Op } from "sequelize";

class localController {
  async getLocais(req, res) {
    try {
      const { inquilinoId, cidade } = req.query;

      if (cidade) {
        let enderecosCidade = await Endereco.findAll({
          where: {
            InquilinoId: inquilinoId,
            ReferenciaTipo: "Local",
            Cidade: {
              [Op.substring]: cidade,
            },
          },
          include: [{ model: Inquilino }],
        });

        let locaisId = enderecosCidade.map(e => e.ReferenciaId);
        let locais = await Local.findAll({
          where: {
            LocalId: locaisId,
          }
        });
        
        if (locais.length > 0) {
          locais = locais.map((carro) => LocalDTO.fromEntity(carro));
          return res.json(locais);
        } else res.status(400).json({ error: "Locais não encontrados" });
      } else {
        let locaisExists = await Local.findAll({
          where: {
            InquilinoId: inquilinoId,
            Ativo: true,
          },
          include: [{ model: Inquilino }],
        });

        if (locaisExists.length > 0) {
          let locais = locaisExists.map((local) => LocalDTO.fromEntity(local));
          return res.json(locais);
        } else res.status(400).json({ error: "Locals não encontrados" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getLocalByPk(req, res) {
    try {
      const { localId } = req.params;
      let local = await Local.findByPk(localId, {
        include: [{ model: Inquilino }],
      });
      if (!local) return res.status(400).json({ error: "Local não existe" });

      await local.getEndereco();
      return res.json(LocalDTO.fromEntity(local));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createLocal(req, res) {
    try {
      const localEntidade = LocalDTO.toEntity(req.body);
      var endereco = req.body.Endereco;

      if (
        Local.validateLocal(localEntidade) &&
        Local.validateEndereco(endereco)
      ) {
        let local = await Local.create(localEntidade);

        if (local.LocalId > 0) {
          local.Endereco = await Endereco.create({
            ...endereco,
            ReferenciaId: local.LocalId,
            ReferenciaTipo: "Local",
            InquilinoId: local.InquilinoId,
          });

          if (local.Endereco.EnderecoId > 0) return res.json(local);
          else return res.status(400).json({ erro: "Erro ao criar endereço" });
        }
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

  async updateLocal(req, res) {
    try {
      const localEntidade = LocalDTO.toEntity(req.body);

      if (Local.validateLocal(localEntidade)) {
        const { localId } = req.params;
        const { adminId } = req.query;

        let localExists = await Local.findByPk(localId, {
          include: [{ model: Inquilino }],
        });

        if (!localExists)
          return res.res.status(400).json({ erro: "Local não existe" });

        await Local.update(localEntidade, {
          where: { LocalId: localId },
        });

        let localUpdated = await Local.findByPk(localId, {
          include: [{ model: Inquilino }],
        });

        localExists = LocalDTO.fromEntity(localExists.get({ plain: true }));
        localUpdated = LocalDTO.fromEntity(localUpdated.get({ plain: true }));

        await LogSistema.setLogSistema(
          LocalDTO.toEntity(localExists),
          LocalDTO.toEntity(localUpdated),
          adminId,
          { ReferenciaId: localId, ReferenciaTipo: "Local" }
        );

        return res.json(localUpdated);
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

  async deleteLocal(req, res) {
    try {
      const { localId } = req.params;
      const { adminId } = req.query;

      let localExists = await Local.findByPk(localId, {
        include: [{ model: Inquilino }],
      });

      if (!localExists)
        return res.status(400).json({ erro: "Local não existe" });

      await localExists.getEndereco();
      localExists = LocalDTO.fromEntity(localExists);

      await Local.destroy({
        where: {
          LocalId: localId,
        },
      })
        .then((data) => console.log("Local excluído"))
        .catch((err) => console.log(err));

      await Endereco.destroy({
        where: {
          ReferenciaId: localId,
          ReferenciaTipo: "Local",
        },
      })
        .then((data) => console.log("Endereco do local excluído"))
        .catch((err) => console.log(err));

      await LogSistema.setDeleteLog(localExists, adminId, {
        ReferenciaId: localId,
        ReferenciaTipo: "Local",
      });

      return res.send("Excluído");
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new localController();
