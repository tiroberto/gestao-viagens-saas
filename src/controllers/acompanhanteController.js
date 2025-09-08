import Acompanhante from "../models/Acompanhante.js";
import AcompanhanteDTO from "../models/dto/AcompanhanteDTO.js";
import Inquilino from "../models/Inquilino.js";
import Endereco from "../models/Endereco.js";
import LogSistema from "../models/LogSistema.js";
import PassageiroViagem from "../models/PassageiroViagem.js";

class acompanhanteController {
  async getAcompanhantes(req, res) {
    try {
      const { inquilinoId } = req.query
      const { cpf } = req.query;

      if (cpf) {
        let acompanhante = await Acompanhante.findOne({
          where: {
            InquilinoId: inquilinoId,
            CPF: cpf,
          },
          include: [
            { model: Inquilino },
            { model: PassageiroViagem, as: "Viagens" },
          ],
        });

        if (!acompanhante)
          res.status(400).json({ error: "Acompanhante não encontrado" });

        acompanhante = AcompanhanteDTO.fromEntity(acompanhante);

        acompanhante.Endereco = Endereco.findOne({
          where: {
            ReferenciaId: acompanhante.AcompanhanteId,
            ReferenciaTipo: "Acompanhante",
          },
        });

        return res.json(acompanhante);
      } else {
        const acompanhantes = await Acompanhante.findAll({
          where: {
            InquilinoId: inquilinoId,
            Ativo: true,
          },
          include: [{ model: Inquilino }],
        });

        if (acompanhantes.length > 0) {
          acompanhantes.forEach((acompanhante) =>
            AcompanhanteDTO.fromEntity(acompanhante)
          );
          return res.json(acompanhantes);
        }

        return res.status(400).json({ error: "Acompanhantes não encontrados" });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getAcompanhantesInativos(req, res) {
    try {
      const { inquilinoId } = req.query
      const acompanhantes = await Acompanhante.findAll({
        where: {
          InquilinoId: inquilinoId,
          Ativo: false,
        },
        include: [{ model: Inquilino }],
      });

      if (acompanhantes.length > 0) {
        acompanhantes.forEach((acompanhante) =>
          AcompanhanteDTO.fromEntity(acompanhante)
        );
        return res.json(acompanhantes);
      } else res.status(400).json({ error: "Acompanhantes não encontrados" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getAcompanhanteByPk(req, res) {
    try {
      const { acompanhanteId } = req.params;
      let acompanhante = await Acompanhante.findByPk(acompanhanteId, {
        include: [
          { model: Inquilino },
          { model: PassageiroViagem, as: "Viagens" },
        ],
      });
      if (!acompanhante)
        return res.status(400).json({ error: "Acompanhante não existe" });

      acompanhante = AcompanhanteDTO.fromEntity(acompanhante);

      acompanhante.Endereco = await Endereco.findOne({
        where: {
          ReferenciaId: acompanhanteId,
          ReferenciaTipo: "Acompanhante",
        },
      });

      return res.json(acompanhante);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createAcompanhante(req, res) {
    try {
      const acompanhanteEntidade = AcompanhanteDTO.toEntity(req.body);

      let resultValidacao = Acompanhante.validateAcompanhante(acompanhanteEntidade)
      //console.log(resultValidacao);
      if (resultValidacao) {
        const { InquilinoId } = acompanhanteEntidade;

        const acompanhanteExists = await Acompanhante.findOne({
          where: {
            InquilinoId: InquilinoId,
            CPF: acompanhanteEntidade.CPF,
          },
        });

        //let acompanhante = req.body;
        //acompanhante.InquilinoId = req.body.Inquilino.InquilinoId;

        if (acompanhanteExists)
          return res.status(400).json({ error: "Acompanhante já existe" });

        let acompanhante = await Acompanhante.create(acompanhanteEntidade);
        return res.json(AcompanhanteDTO.fromEntity(acompanhante));
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

  async updateAcompanhante(req, res) {
    try {
      const acompanhanteEntidade = AcompanhanteDTO.toEntity(req.body);
      if (Acompanhante.validateAcompanhante(acompanhanteEntidade)) {
        const { acompanhanteId } = req.params;
        const { adminId } = req.query;
        const { InquilinoId } = acompanhanteEntidade;

        let acompanhanteExists = await Acompanhante.findByPk(acompanhanteId, {
          include: [
            { model: Inquilino },
            { model: PassageiroViagem, as: "Viagens" },
          ],
        });

        if(!acompanhanteExists)
          return res.status(400).json({ erro: "Acompanhante não existe "})

        if (acompanhanteEntidade.CPF != acompanhanteExists.CPF) {
          const acompanhante = await Acompanhante.findOne({
            where: {
              InquilinoId: InquilinoId,
              CPF: acompanhanteEntidade.CPF,
            },
          });
 
          if (acompanhante) {
            return res
              .status(400)
              .json({ error: "Acompanhante com este CPF já existe" });
          }
        }

        await Acompanhante.update(acompanhanteEntidade, {
          where: { AcompanhanteId: acompanhanteEntidade.AcompanhanteId },
        });

        let acompanhanteUpdated = await Acompanhante.findByPk(acompanhanteId, {
          include: [
            { model: Inquilino },
            { model: PassageiroViagem, as: "Viagens" },
          ],
        });
        acompanhanteExists = AcompanhanteDTO.fromEntity(acompanhanteExists.get({ plain: true }));
        acompanhanteUpdated = AcompanhanteDTO.fromEntity(acompanhanteUpdated.get({ plain: true }));
        
                

        await LogSistema.setLogSistema(
          AcompanhanteDTO.toEntity(acompanhanteExists),
          AcompanhanteDTO.toEntity(acompanhanteUpdated),
          adminId,
          { ReferenciaId: acompanhanteId, ReferenciaTipo: "Acompanhante" }
        );

        return res.json(acompanhanteUpdated);
      } else return res.status(400).json({ erro: "Erro na validação " });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          errors: error.errors, // lista de mensagens de erro
        });
      }
      res.status(500).json({ error: error.message, errorName: error.name });
    }
  }

  async inactivateAcompanhante(req, res) {
    try {
      const { acompanhanteId } = req.params;
      const { adminId } = req.query;
      const { inquilinoId } = req.query

      var acompanhanteExists = await Acompanhante.findByPk(acompanhanteId, {
        where: { InquilinoId: InquilinoId },
        include: [
          { model: Inquilino },
        ],
      });

      if (!acompanhanteExists)
        return res.status(400).json({ error: "Acompanhante não existe" });

      await Acompanhante.update(
        { Ativo: false },
        { where: { AcompanhanteId: acompanhanteId } }
      );

      let acompanhanteUpdated = await Acompanhante.findByPk(acompanhanteId, {
        where: { InquilinoId: InquilinoId },
        include: [
          { model: Inquilino },
        ],
      });
      acompanhanteExists = AcompanhanteDTO.fromEntity(
        acompanhanteExists.get({ plain: true })
      );
      acompanhanteUpdated = AcompanhanteDTO.fromEntity(
        acompanhanteUpdated.get({ plain: true })
      );
      //console.log(acompanhanteExists);
      await LogSistema.setLogSistema(
        AcompanhanteDTO.toEntity(acompanhanteExists),
        AcompanhanteDTO.toEntity(acompanhanteUpdated),
        adminId,
        { ReferenciaId: acompanhanteId, ReferenciaTipo: "Acompanhante" }
      );

      return res.json({ message: "Acompanhante inativado" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  async activateAcompanhante(req, res) {
    try {
      const { acompanhanteId } = req.params;
      const { adminId } = req.query;
      const { inquilinoId } = req.query

      var acompanhanteExists = await Acompanhante.findByPk(acompanhanteId, {
        where: { InquilinoId: InquilinoId },
        include: [
          { model: Inquilino },
        ],
      });

      if (!acompanhanteExists)
        return res.status(400).json({ error: "Acompanhante não existe" });

      await Acompanhante.update(
        { Ativo: true },
        { where: { AcompanhanteId: acompanhanteId } }
      );

      let acompanhanteUpdated = await Acompanhante.findByPk(acompanhanteId, {
        where: { InquilinoId: InquilinoId },
        include: [
          { model: Inquilino },
        ],
      });
      acompanhanteExists = AcompanhanteDTO.fromEntity(
        acompanhanteExists.get({ plain: true })
      );
      acompanhanteUpdated = AcompanhanteDTO.fromEntity(
        acompanhanteUpdated.get({ plain: true })
      );

      await LogSistema.setLogSistema(
        AcompanhanteDTO.toEntity(acompanhanteExists),
        AcompanhanteDTO.toEntity(acompanhanteUpdated),
        adminId,
        { ReferenciaId: acompanhanteId, ReferenciaTipo: "Acompanhante" }
      );

      return res.json({ message: "Acompanhante ativado" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteAcompanhante(req, res) {
    try {
      const { acompanhanteId } = req.params;
      const { adminId } = req.query;

      let acompanhanteExists = await Acompanhante.findByPk(acompanhanteId, {
        include: [{ model: Inquilino }, { model: PassageiroViagem, as: "Viagens" }],
      });

      
      if (!acompanhanteExists)
        return res.status(400).json({ erro: "Acompanhante não existe" });
      
      acompanhanteExists = AcompanhanteDTO.fromEntity(acompanhanteExists);

      await PassageiroViagem.update({ AcompanhanteId: null },{
        where: {
          AcompanhanteId: acompanhanteId,
        },
      })
        .then((data) => console.log("Inclusões em viagens retiradas"))
        .catch((err) => console.log(err));
      await Acompanhante.destroy({
        where: {
          AcompanhanteId: acompanhanteId,
        },
      })
        .then((data) => console.log("Acompanhante excluído"))
        .catch((err) => console.log(err));
      await Endereco.destroy({
        where: {
          ReferenciaId: acompanhanteId,
          ReferenciaTipo: "Acompanhante",
        },
      })
        .then((data) => console.log("Endereços excluídos"))
        .catch((err) => console.log(err));

      await LogSistema.setDeleteLog(acompanhanteExists, adminId, {
        ReferenciaId: acompanhanteId,
        ReferenciaTipo: "Acompanhante",
      });

      return res.send("Excluído");
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new acompanhanteController();
