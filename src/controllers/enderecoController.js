import Endereco from "../models/Endereco.js";
import EnderecoDTO from "../models/dto/EnderecoDTO.js";
import Inquilino from "../models/Inquilino.js";
import LogSistema from "../models/LogSistema.js";
import Viagem from "../models/Viagem.js";
import Setor from "../models/Setor.js";
import { Op } from "sequelize";

class enderecoController {
  async getEnderecosByReferencia(req, res) {
    try {
      const referencia = req.body;

      if (referencia) {
        let enderecosExists = await Endereco.findAll({
          where: {
            InquilinoId: referencia.InquilinoId,
            ReferenciaId: referencia.ReferenciaId,
            ReferenciaTipo: referencia.ReferenciaTipo,
          },
          include: [{ model: Inquilino }],
        });

        if (enderecosExists.length > 0) {
          let enderecos = enderecosExists.map((endereco) =>
            EnderecoDTO.fromEntity(endereco)
          );
          return res.json(enderecos);
        } else res.status(400).json({ error: "Enderecos não encontrados" });
      } else res.status(400).json({ error: "Referencia não informada" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEnderecoByPk(req, res) {
    try {
      const { enderecoId } = req.params;
      const endereco = await Endereco.findByPk(enderecoId, {
        include: [{ model: Inquilino }],
      });
      if (!endereco)
        return res.status(400).json({ error: "Endereco não existe" });

      return res.json(EnderecoDTO.fromEntity(endereco));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createEndereco(req, res) {
    try {
      const enderecoEntidade = EnderecoDTO.toEntity(req.body);
      console.log(enderecoEntidade);

      if (Endereco.validateEndereco(enderecoEntidade)) {
        const endereco = await Endereco.create(enderecoEntidade);
        return res.json(endereco);
      } else return res.status(400).json({ erro: "Erro na validação" });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          errors: error.errors, // lista de mensagens de erro
        });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async updateEndereco(req, res) {
    try {
      const enderecoEntidade = EnderecoDTO.toEntity(req.body);

      if (Endereco.validateEndereco(enderecoEntidade)) {
        const { enderecoId } = req.params;
        const { adminId } = req.query;

        let enderecoExists = await Endereco.findByPk(enderecoId, {
          include: [{ model: Inquilino }],
        });

        if (!enderecoExists)
          return res.res.status(400).json({ erro: "Endereco não existe" });

        await Endereco.update(enderecoEntidade, {
          where: { EnderecoId: enderecoId },
        });

        let enderecoUpdated = await Endereco.findByPk(enderecoId, {
          include: [{ model: Inquilino }],
        });

        enderecoExists = EnderecoDTO.fromEntity(
          enderecoExists.get({ plain: true })
        );
        enderecoUpdated = EnderecoDTO.fromEntity(
          enderecoUpdated.get({ plain: true })
        );

        await LogSistema.setLogSistema(
          EnderecoDTO.toEntity(enderecoExists),
          EnderecoDTO.toEntity(enderecoUpdated),
          adminId,
          { ReferenciaId: enderecoId, ReferenciaTipo: "Endereco" }
        );

        return res.json(enderecoUpdated);
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

  async deleteEndereco(req, res) {
    try {
      const { enderecoId } = req.params;
      const { adminId } = req.query;

      let enderecoExists = await Endereco.findByPk(enderecoId, {
        include: [{ model: Inquilino }],
      });

      if (!enderecoExists)
        return res.status(400).json({ erro: "Endereco não existe" });

      enderecoExists = EnderecoDTO.fromEntity(enderecoExists);

      await Endereco.destroy({
        where: {
          EnderecoId: enderecoId,
        },
      })
        .then((data) => console.log("Endereco excluído"))
        .catch((err) => console.log(err));

      await LogSistema.setDeleteLog(enderecoExists, adminId, {
        ReferenciaId: enderecoId,
        ReferenciaTipo: "Endereco",
      });

      return res.send("Excluído");
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new enderecoController();
