import { Op } from "sequelize";
import AdministradorDTO from "../models/dto/AdministradorDTO.js";
import Administrador from "../models/Administrador.js";
import Inquilino from "../models/Inquilino.js";
import LogSistema from "../models/LogSistema.js";
import Setor from "../models/Setor.js";
import Viagem from "../models/Viagem.js";
import Endereco from "../models/Endereco.js";

class administradorController {
  async getAdministradores(req, res) {
    try {
      const { inquilinoId } = req.query;
      const { cpf, email } = req.query;

      if (cpf) {
        let administrador = await Administrador.findOne({
          where: {
            InquilinoId: inquilinoId,
            CPF: cpf,
          },
          include: [{ model: Inquilino }, { model: Setor }],
        });

        if (!administrador)
          return res.status(400).json({ erro: "Administrador não existe" });

        administrador = AdministradorDTO.fromEntity(administrador);
        administrador.Endereco = await Endereco.findOne({
          where: {
            ReferenciaId: administrador.AdministradorId,
            ReferenciaTipo: "Administrador",
          },
        });

        return res.json(administrador);
      } else if (email) {
        let administrador = await Administrador.findOne({
          where: {
            InquilinoId: inquilinoId,
            Email: email,
          },
          include: [{ model: Inquilino }, { model: Setor }],
        });

        if (!administrador)
          return res.status(400).json({ erro: "Administrador não existe" });

        administrador = AdministradorDTO.fromEntity(administrador);
        administrador.Endereco = await Endereco.findOne({
          where: {
            ReferenciaId: administrador.AdministradorId,
            ReferenciaTipo: "Administrador",
          },
        });

        return res.json(administrador);
      } else {
        const administradores = await Administrador.findAll({
          where: {
            InquilinoId: inquilinoId,
            Ativo: true,
          },
          include: [{ model: Inquilino }, { model: Setor }],
        });

        if (administradores.length > 0) {
          administradores.forEach((administrador) => {
            administrador = AdministradorDTO.fromEntity(administrador);
          });
          return res.json(administradores);
        } else
          return res
            .status(400)
            .json({ erro: "Administradors não foram encontrados" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message, errorName: err.name });
    }
  }

  async getAdministradoresInativos(req, res) {
    try {
      const { inquilinoId } = req.query;

      let administradores = await Administrador.findAll({
        where: {
          InquilinoId: inquilinoId,
          Ativo: false,
        },
        include: [{ model: Inquilino }, { model: Setor }],
      });

      if (administradores.length > 0) {
        administradores.forEach(
          (administrador) =>
            (administrador = AdministradorDTO.fromEntity(administrador))
        );

        return res.json(administradores);
      } else
        return res
          .status(400)
          .json({ erro: "Administradores não foram encontrados" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

  async getAdministradorByPk(req, res) {
    try {
      const { administradorId } = req.params;
      const { inquilinoId } = req.query;

      let administrador = await Administrador.findByPk(administradorId, {
        where: {
          InquilinoId: inquilinoId,
        },
        include: [
          { model: Inquilino }, 
          { model: Setor },
        ],
      });
      //console.log(administradorId);
      if (!administrador)
        return res.status(400).json({ error: "Administrador não existe" });

      /*administrador = AdministradorDTO.fromEntity(administrador);
      administrador.Endereco = await Endereco.findOne({
        where: {
          ReferenciaId: administrador.AdministradorId,
          ReferenciaTipo: "Administrador",
        },
      });*/
      return res.json(administrador);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createAdministrador(req, res) {
    try {
      var administradorEntidade = AdministradorDTO.toEntity(req.body);

      if (Administrador.validateAdministrador(administradorEntidade)) {
        console.log(administradorEntidade);
        const { InquilinoId } = administradorEntidade;
        var administradorExists = await Administrador.findOne({
          where: {
            [Op.or]: [
              { CPF: administradorEntidade.CPF },
              { Email: administradorEntidade.Email },
            ],
            InquilinoId: InquilinoId,
          },
        });

        if (administradorExists) {
          if (administradorExists.CPF == administradorEntidade.CPF)
            return res.status(400).json({ error: "Administrador com este CPF já existe" });
          else if (administradorExists.Email == administradorEntidade.Email)
            return res.status(400).json({ error: "Administrador com este email já existe" });
        }

        administradorEntidade.Senha = Administrador.gerarHashSenha(
          administradorEntidade.Senha
        );
        const administrador = await Administrador.create(administradorEntidade);

        return res.json(administrador);
      } else res.status(400).json({ erro: "Erro na validação" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async updateAdministrador(req, res) {
    try {
      var administradorEntidade = AdministradorDTO.toEntity(req.body);

      if (Administrador.validateAdministrador(administradorEntidade)) {
        const { administradorId } = req.params;
        const { adminId } = req.query;
        const { InquilinoId } = administradorEntidade;

        //console.log(administradorEntidade);
        var administradorExists = await Administrador.findByPk(administradorId,{
            include: [{ model: Inquilino }, { model: Setor }],
          }
        );

        if (administradorEntidade.CPF != administradorExists.CPF) {
          const administrador = await Administrador.findOne({
            where: {
              CPF: administradorEntidade.CPF,
              InquilinoId: InquilinoId,
            },
          });

          if (administrador)
            return res.status(400).json({ error: "Administrador já existe" });
        }

        if (Administrador.comparaSenha(administradorEntidade.Senha,administradorExists.Senha))
          administradorEntidade.Senha = administradorExists.Senha;
        else
          administradorEntidade.Senha = Administrador.gerarHashSenha(administradorEntidade.Senha);

        //console.log(administradorEntidade);
        await Administrador.update(administradorEntidade, {
          where: {
            AdministradorId: administradorId,
          },
        });

        var administradorUpdated = await Administrador.findByPk(administradorId,{
            include: [{ model: Inquilino }, { model: Setor }],
          }
        );

        administradorExists = AdministradorDTO.fromEntity(administradorExists.get({ plain: true }));
        administradorUpdated = AdministradorDTO.fromEntity(administradorUpdated.get({ plain: true }));

        //cria um log das mudanças
        await LogSistema.setLogSistema(
          AdministradorDTO.toEntity(administradorExists),
          AdministradorDTO.toEntity(administradorUpdated),
          adminId,
          { ReferenciaId: administradorId, ReferenciaTipo: "Administrador" }
        );

        return res.json(administradorUpdated);
      } else res.status(400).json({ erro: "Erro na validação" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async inactivateAdministrador(req, res) {
    try {
      const { administradorId } = req.params;
      const { adminId } = req.query;
      const { inquilinoId } = req.query;

      var administradorExists = await Administrador.findByPk(administradorId, {
        where: { InquilinoId: InquilinoId },
        include: [{ model: Inquilino }, { model: Setor }],
      });

      if (!administradorExists)
        return res.status(400).json({ error: "Administrador não existe" });

      await Administrador.update(
        { Ativo: false },
        { where: { AdministradorId: administradorId } }
      );

      let administradorUpdated = await Administrador.findByPk(administradorId, {
        where: { InquilinoId: InquilinoId },
        include: [{ model: Inquilino }, { model: Setor }],
      });
      administradorExists = AdministradorDTO.fromEntity(
        administradorExists.get({ plain: true })
      );
      administradorUpdated = AdministradorDTO.fromEntity(
        administradorUpdated.get({ plain: true })
      );

      await LogSistema.setLogSistema(
        AdministradorDTO.toEntity(administradorExists),
        AdministradorDTO.toEntity(administradorUpdated),
        adminId,
        { ReferenciaId: administradorId, ReferenciaTipo: "Administrador" }
      );

      return res.json({ message: "Administrador inativado" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  async activateAdministrador(req, res) {
    try {
      const { administradorId } = req.params;
      const { adminId } = req.query;
      const { inquilinoId } = req.query;

      var administradorExists = await Administrador.findByPk(administradorId, {
        where: { InquilinoId: InquilinoId },
        include: [{ model: Inquilino }, { model: Setor }],
      });

      if (!administradorExists)
        return res.status(400).json({ error: "Administrador não existe" });

      await Administrador.update(
        { Ativo: true },
        { where: { AdministradorId: administradorId } }
      );

      let administradorUpdated = await Administrador.findByPk(administradorId, {
        where: { InquilinoId: InquilinoId },
        include: [{ model: Inquilino }, { model: Setor }],
      });

      administradorExists = AdministradorDTO.fromEntity(
        administradorExists.get({ plain: true })
      );
      administradorUpdated = AdministradorDTO.fromEntity(
        administradorUpdated.get({ plain: true })
      );

      await LogSistema.setLogSistema(
        AdministradorDTO.toEntity(administradorExists),
        AdministradorDTO.toEntity(administradorUpdated),
        adminId,
        { ReferenciaId: administradorId, ReferenciaTipo: "Administrador" }
      );

      return res.json({ message: "Administrador ativado" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteAdministrador(req, res) {
    try {
      const { administradorId } = req.params;
      const { adminId } = req.query;

      let administradorExists = await Administrador.findByPk(administradorId, {
        include: [
          { model: Inquilino },
          { model: Setor },
          { model: Viagem, as: "Viagens" },
          { model: LogSistema, as: "LogsSistema" },
        ],
      });

      if (!administradorExists)
        return res.status(400).json({ erro: "Administrador não existe" });

      administradorExists = AdministradorDTO.fromEntity(administradorExists);

      if (!administradorExists.Setor 
          && !(administradorExists.Viagens.length > 0)
          && !(administradorExists.LogsSistema.length > 0)) {
        await Administrador.destroy({
          where: {
            AdministradorId: administradorId,
          },
        });
        await Endereco.destroy({
          where: {
            ReferenciaId: administradorId,
            ReferenciaTipo: "Administrador",
          },
        });
        await LogSistema.setDeleteLog(administradorExists, adminId, {
          ReferenciaId: administradorId,
          ReferenciaTipo: "Administrador",
        });
        return res.send("Excluído");
      } else
        return res.status(400).json({
          erro: "Não pode ser excluído, pois existem registros deste administrador",
        });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new administradorController();
