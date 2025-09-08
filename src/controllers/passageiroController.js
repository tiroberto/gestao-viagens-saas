import Passageiro from "../models/Passageiro.js";
import PassageiroDTO from "../models/dto/PassageiroDTO.js";
import Inquilino from "../models/Inquilino.js";
import Endereco from "../models/Endereco.js";
import LogSistema from "../models/LogSistema.js";
import Viagem from "../models/Viagem.js";
import PassageiroViagem from "../models/PassageiroViagem.js";

class passageiroController {
  async getPassageiros(req, res) {
    try {
      const { inquilinoId } = req.query;
      const { cpf } = req.query;

      if (cpf) {
        let passageiro = await Passageiro.findOne({
          where: {
            CPF: cpf,
            InquilinoId: inquilinoId,
          },
          include: [{ model: Inquilino }, { model: Viagem, as: "Viagens" }],
        });

        if(!passageiro)
          res.status(400).json({ erro: "Passageiro não existe" });

        passageiro = PassageiroDTO.fromEntity(passageiro);

        passageiro.Endereco = Endereco.findOne({
          where: {
            ReferenciaId: passageiro.PassageiroId,
            ReferenciaTipo: "Passageiro",
          },
        });

        return res.json(passageiro);
      } else {
        const passageiros = await Passageiro.findAll({
          where: {
            InquilinoId: inquilinoId,
            Ativo: true,
          },
          include: [{ model: Inquilino }],
        });
        if (passageiros.length > 0) {
          passageiros.forEach((passageiro) =>
            PassageiroDTO.fromEntity(passageiro)
          );
          return res.json(passageiros);
        } else res.status(400).json({ error: "Passageiros não encontrados" });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getPassageirosInativos(req, res) {
    try {
      const { inquilinoId } = req.query;
      const passageiros = await Passageiro.findAll({
        where: {
          InquilinoId: inquilinoId,
          Ativo: false,
        },
        include: [{ model: Inquilino }],
      });

      if (passageiros.length > 0) {
        passageiros.forEach((passageiro) =>
          PassageiroDTO.fromEntity(passageiro)
        );
        return res.json(passageiros);
      } else res.status(400).json({ error: "Passageiros não encontrados" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getPassageiroByPk(req, res) {
    try {
      const { passageiroId } = req.params;
      const passageiro = await Passageiro.findByPk(passageiroId, {
        include: [{ model: Inquilino }, { model: Viagem, as: "Viagens" }],
      });
      if (!passageiro)
        return res.status(400).json({ error: "Passageiro não existe" });

      passageiro.Endereco = await Endereco.findOne({
        where: {
          ReferenciaId: passageiroId,
          ReferenciaTipo: "Passageiro",
        },
      });
      return res.json(PassageiroDTO.fromEntity(passageiro));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createPassageiro(req, res) {
    try {
      const passageiroEntidade = PassageiroDTO.toEntity(req.body);

      if (Passageiro.validatePassageiro(passageiroEntidade)) {
        const { InquilinoId } = passageiroEntidade;

        const passageiroExists = await Passageiro.findOne({
          where: {
            InquilinoId: InquilinoId,
            CPF: passageiroEntidade.CPF,
          },
        });

        //let passageiro = req.body;
        //passageiro.InquilinoId = req.body.Inquilino.InquilinoId;

        if (passageiroExists)
          return res.status(400).json({ error: "Passageiro já existe" });

        const passageiro = await Passageiro.create(passageiroEntidade);
        return res.json(passageiro);
      } else return res.status(400).json({ erro: "Erro na validação" });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          errors: error.errors, // lista de mensagens de erro
        });
      }
      res.status(500).json({ error: error });
    }
  }

  async updatePassageiro(req, res) {
    try {
      const passageiroEntidade = PassageiroDTO.toEntity(req.body);

      if (Passageiro.validatePassageiro(passageiroEntidade)) {
        const { passageiroId } = req.params;
        const { adminId } = req.query;
        const { InquilinoId } = passageiroEntidade;

        let passageiroExists = await Passageiro.findByPk(passageiroId, {
          include: [{ model: Inquilino }],
        });

        if (passageiroEntidade.CPF != passageiroExists.CPF) {
          const passageiro = await Passageiro.findOne({
            where: {
              InquilinoId: InquilinoId,
              CPF: passageiroEntidade.CPF,
            },
          });

          if (passageiro) {
            return res
              .status(400)
              .json({ error: "Passageiro com este CPF já existe" });
          }
        }

        await Passageiro.update(passageiroEntidade, {
          where: { PassageiroId: passageiroEntidade.PassageiroId },
        });

        let passageiroUpdated = await Passageiro.findByPk(passageiroId, {
          include: [{ model: Inquilino }],
        });

        passageiroExists = PassageiroDTO.fromEntity(passageiroExists.get({ plain: true }));
        passageiroUpdated = PassageiroDTO.fromEntity(passageiroUpdated.get({ plain: true }));

        await LogSistema.setLogSistema(
          PassageiroDTO.toEntity(passageiroExists),
          PassageiroDTO.toEntity(passageiroUpdated),
          adminId,
          { ReferenciaId: passageiroId, ReferenciaTipo: "Passageiro" }
        );

        return res.json(passageiroUpdated);
      } else return res.status(400).json({ erro: "Erro na validação " });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          errors: error.errors, // lista de mensagens de erro
        });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async inactivatePassageiro(req, res) {
    try {
      const { passageiroId } = req.params;
      const { adminId } = req.query;
      const { inquilinoId } = req.query;

      var passageiroExists = await Passageiro.findByPk(passageiroId, {
        where: { InquilinoId: InquilinoId },
        include: [{ model: Inquilino }],
      });

      if (!passageiroExists)
        return res.status(400).json({ error: "Passageiro não existe" });

      await Passageiro.update(
        { Ativo: false },
        { where: { PassageiroId: passageiroId } }
      );

      let passageiroUpdated = await Passageiro.findByPk(passageiroId, {
        where: { InquilinoId: InquilinoId },
        include: [{ model: Inquilino }],
      });

      passageiroExists = PassageiroDTO.fromEntity(passageiroExists.get({ plain: true }));
      passageiroUpdated = PassageiroDTO.fromEntity(passageiroUpdated.get({ plain: true }));

      await LogSistema.setLogSistema(
        PassageiroDTO.toEntity(passageiroExists),
        PassageiroDTO.toEntity(passageiroUpdated),
        adminId,
        { ReferenciaId: passageiroId, ReferenciaTipo: "Passageiro" }
      );

      return res.json({ message: "Passageiro inativado" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  async activatePassageiro(req, res) {
    try {
      const { passageiroId } = req.params;
      const { adminId } = req.query;
      const { inquilinoId } = req.query;

      var passageiroExists = await Passageiro.findByPk(passageiroId, {
        where: { InquilinoId: InquilinoId },
        include: [{ model: Inquilino }],
      });

      if (!passageiroExists)
        return res.status(400).json({ error: "Passageiro não existe" });

      await Passageiro.update(
        { Ativo: true },
        { where: { PassageiroId: passageiroId } }
      );

      let passageiroUpdated = await Passageiro.findByPk(passageiroId, {
        where: { InquilinoId: InquilinoId },
        include: [{ model: Inquilino }],
      });
      passageiroExists = PassageiroDTO.fromEntity(
        passageiroExists.get({ plain: true })
      );
      passageiroUpdated = PassageiroDTO.fromEntity(
        passageiroUpdated.get({ plain: true })
      );

      await LogSistema.setLogSistema(
        PassageiroDTO.toEntity(passageiroExists),
        PassageiroDTO.toEntity(passageiroUpdated),
        adminId,
        { ReferenciaId: passageiroId, ReferenciaTipo: "Passageiro" }
      );

      return res.json({ message: "Passageiro ativado" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  async deletePassageiro(req, res) {
    try {
      const { passageiroId } = req.params;
      const { adminId } = req.query;

      let passageiroExists = await Passageiro.findByPk(passageiroId, {
        include: [{ model: Inquilino }, { model: Viagem, as: "Viagens" }],
      });
      
      if (!passageiroExists)
        return res.status(400).json({ erro: "Passageiro não existe" });
      
      passageiroExists = PassageiroDTO.fromEntity(passageiroExists);
      
      await PassageiroViagem.destroy({
        where: {
          PassageiroId: passageiroId,
        },
      })
        .then((data) => console.log("Inclusões em viagens excluídas"))
        .catch((err) => console.log(err));

      await Passageiro.destroy({
        where: {
          PassageiroId: passageiroId,
        },
      })
        .then((data) => console.log("Passageiro excluído"))
        .catch((err) => console.log(err));
      await Endereco.destroy({
        where: {
          ReferenciaId: passageiroId,
          ReferenciaTipo: "Passageiro",
        },
      })
        .then((data) => console.log("Endereços excluídos"))
        .catch((err) => console.log(err));

      await LogSistema.setDeleteLog(passageiroExists, adminId, {
        ReferenciaId: passageiroId,
        ReferenciaTipo: "Passageiro",
      });

      return res.send("Excluído");
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new passageiroController();
