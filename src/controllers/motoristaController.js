import { Op } from "sequelize";
import MotoristaDTO from "../models/dto/MotoristaDTO.js";
import Motorista from "../models/Motorista.js";
import Inquilino from "../models/Inquilino.js";
import LogSistema from "../models/LogSistema.js";
import Setor from "../models/Setor.js";
import Viagem from "../models/Viagem.js";
import Endereco from "../models/Endereco.js";

class motoristaController {
  async getMotoristas(req, res) {
    try {
      const { inquilinoId } = req.query
      const { cpf, email, cnh, setorId } = req.query;

      if (cpf) {
        let motorista = await Motorista.findOne({
          where: {
            InquilinoId: inquilinoId,
            CPF: cpf,
          },
          include: [{ model: Inquilino }, { model: Setor }],
        });

        if(!motorista)
          res.status(400).json({ erro: "Motorista não existe" });

        motorista = MotoristaDTO.fromEntity(motorista);
        motorista.Endereco = Endereco.findOne({
          where: {
            ReferenciaId: motorista.MotoristaId,
            ReferenciaTipo: "Motorista",
          },
        });
          
        return res.json(motorista);
      } else if (email) {
        let motorista = await Motorista.findOne({
          where: {
            InquilinoId: inquilinoId,
            Email: email,
          },
          include: [{ model: Inquilino }, { model: Setor }],
        });
        
        if(!motorista)
          res.status(400).json({ erro: "Motorista não existe" });

        motorista = MotoristaDTO.fromEntity(motorista);
        motorista.Endereco = Endereco.findOne({
          where: {
            ReferenciaId: motorista.MotoristaId,
            ReferenciaTipo: "Motorista",
          },
        });
          
        return res.json(motorista);
      } else if (cnh) {
        let motorista = await Motorista.findOne({
          where: {
            InquilinoId: inquilinoId,
            CNH: cnh,
          },
          include: [{ model: Inquilino }, { model: Setor }],
        });
        
        if(!motorista)
          res.status(400).json({ erro: "Motorista não existe" });

        motorista = MotoristaDTO.fromEntity(motorista);
        motorista.Endereco = Endereco.findOne({
          where: {
            ReferenciaId: motorista.MotoristaId,
            ReferenciaTipo: "Motorista",
          },
        });
          
        return res.json(motorista);
      } else if (setorId){
        let motoristasExists = await Motorista.findAll({
          where: {
            InquilinoId: inquilinoId,
            SetorId: setorId,
          },
          include: [{ model: Inquilino }, { model: Setor }],
        });

        if (motoristasExists.length > 0) {
          let motoristas = [];
          motoristasExists.forEach((motorista) => motoristas.push(MotoristaDTO.fromEntity(motorista)));
          return res.json(motoristas);
        } else
          return res
            .status(400)
            .json({ erro: "Motoristas não foram encontrados" });
      } else {
        const motoristasExists = await Motorista.findAll({
          where: {
            InquilinoId: inquilinoId,
            Ativo: true,
          },
          include: [{ model: Inquilino }, { model: Setor }],
        });

        if (motoristasExists.length > 0) {
          let motoristas = [];
          motoristasExists.forEach((motorista) => motoristas.push(MotoristaDTO.fromEntity(motorista)));
          return res.json(motoristas);
        } else
          return res
            .status(400)
            .json({ erro: "Motoristas não foram encontrados" });
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

  async getMotoristasInativos(req, res) {
    try {
      const { inquilinoId } = req.query

      const motoristas = await Motorista.findAll({
        where: {
          InquilinoId: inquilinoId,
          Ativo: false,
        },
        include: [{ model: Inquilino }, { model: Setor }],
      });

      if (motoristas.length > 0) {
        motoristas.forEach((motorista) => {
          motorista = MotoristaDTO.fromEntity(motorista);
        });
        return res.json(motoristas);
      } else
        return res
          .status(400)
          .json({ erro: "Motoristas não foram encontrados" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }  

  async getMotoristaByPk(req, res) {
    try {
      const { motoristaId } = req.params;
      const { inquilinoId } = req.query
      const motorista = await Motorista.findByPk(motoristaId, {
        where: {
          InquilinoId: inquilinoId,
        },
        include: [{ model: Inquilino }, { model: Setor }, { model: Viagem, as: "Viagens" }],
      });
      console.log(motoristaId);
      if (!motorista)
        return res.status(400).json({ error: "Motorista não existe" });

      motorista.Endereco = await Endereco.findOne({
        where: {
          ReferenciaId: motorista.MotoristaId,
          ReferenciaTipo: "Motorista",
      }});
      return res.json(MotoristaDTO.fromEntity(motorista));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createMotorista(req, res) {
    try {
      var motoristaEntidade = MotoristaDTO.toEntity(req.body);

      if (Motorista.validateMotorista(motoristaEntidade)) {
        const { InquilinoId } = motoristaEntidade;
        var motoristaExists = await Motorista.findOne({
          where: {
            [Op.or]: [
              { CPF: motoristaEntidade.CPF },
              { Email: motoristaEntidade.Email },
              { CNH: motoristaEntidade.CNH },
            ],
            InquilinoId: InquilinoId,
          },
        });

        if(motoristaExists){
          if (motoristaExists.CPF == motoristaEntidade.CPF)
            return res
              .status(400)
              .json({ error: "Motorista com este CPF já existe" });
          else if (motoristaExists.Email == motoristaEntidade.Email)
            return res
              .status(400)
              .json({ error: "Motorista com este email já existe" });
          else if (motoristaExists.CNH == motoristaEntidade.CNH)
            return res
              .status(400)
              .json({ error: "Motorista com esta CNH já existe" });
        }

        motoristaEntidade.Senha = Motorista.gerarHashSenha(motoristaEntidade.Senha);
        const motorista = await Motorista.create(motoristaEntidade);

        return res.json(motorista);
      } else res.status(400).json({ erro: "Erro na validação" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async updateMotorista(req, res) {
    try {
      var motoristaEntidade = MotoristaDTO.toEntity(req.body);

      if (Motorista.validateMotorista(motoristaEntidade)) {
        const { motoristaId } = req.params;        
        const { adminId } = req.query;
        const { InquilinoId } = motoristaEntidade;

        //console.log(motoristaEntidade);
        var motoristaExists = await Motorista.findByPk(motoristaId, {
          include: [{ model: Inquilino }, { model: Setor }],
        });

        if (motoristaEntidade.CPF != motoristaExists.CPF){
          const motorista = await Motorista.findOne({
            where: {              
              CPF: motoristaEntidade.CPF,
              InquilinoId: InquilinoId,
            },
          });         

          if (motorista)
            return res.status(400).json({ erro: "Motorista existe com algum dos dados informados"});
        }

        if (Motorista.comparaSenha(motoristaEntidade.Senha, motoristaExists.Senha))
          motoristaEntidade.Senha = motoristaExists.Senha;
        else
          motoristaEntidade.Senha = Motorista.gerarHashSenha(motoristaEntidade.Senha);

        //console.log(motoristaEntidade);
        await Motorista.update(motoristaEntidade, {
          where: {
            MotoristaId: motoristaId,
          },
        });

        var motoristaUpdated = await Motorista.findByPk(motoristaId, {
          include: [{ model: Inquilino }, { model: Setor }],
        });
        motoristaExists = MotoristaDTO.fromEntity(motoristaExists.get({ plain: true }));
        motoristaUpdated = MotoristaDTO.fromEntity(motoristaUpdated.get({ plain: true }));

        //cria um log das mudanças
        await LogSistema.setLogSistema(
          MotoristaDTO.toEntity(motoristaExists),
          MotoristaDTO.toEntity(motoristaUpdated),
          adminId,
          { ReferenciaId: motoristaId, ReferenciaTipo: "Motorista" }
        );

        return res.json(motoristaUpdated);
      } else res.status(400).json({ erro: "Erro na validação" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async inactivateMotorista(req, res) {
    try {
      const { motoristaId } = req.params;
      const { adminId } = req.query;
      const { inquilinoId } = req.query

      var motoristaExists = await Motorista.findByPk(motoristaId, {
        where: { InquilinoId: InquilinoId },
        include: [{ model: Inquilino }, { model: Setor }],
      });

      if (!motoristaExists)
        return res.status(400).json({ error: "Motorista não existe" });

      await Motorista.update(
        { Ativo: false },
        { where: { MotoristaId: motoristaId } }
      );

      let motoristaUpdated = await Motorista.findByPk(motoristaId, {
        where: { InquilinoId: InquilinoId },
        include: [{ model: Inquilino }, { model: Setor }],
      });
      motoristaExists = MotoristaDTO.fromEntity(motoristaExists.get({ plain: true }));
      motoristaUpdated = MotoristaDTO.fromEntity(motoristaUpdated.get({ plain: true }));

      await LogSistema.setLogSistema(
        MotoristaDTO.toEntity(motoristaExists),
        MotoristaDTO.toEntity(motoristaUpdated),
        adminId,
        { ReferenciaId: motoristaId, ReferenciaTipo: "Motorista" }
      );

      return res.json({ message: "Motorista inativado" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  async activateMotorista(req, res) {
    try {
      const { motoristaId } = req.params;
      const { adminId } = req.query;
      const { inquilinoId } = req.query

      var motoristaExists = await Motorista.findByPk(motoristaId, {
        where: { InquilinoId: InquilinoId },
        include: [{ model: Inquilino }, { model: Setor }],
      });

      if (!motoristaExists)
        return res.status(400).json({ error: "Motorista não existe" });

      await Motorista.update(
        { Ativo: true },
        { where: { MotoristaId: motoristaId } }
      );

      let motoristaUpdated = await Motorista.findByPk(motoristaId, {
        where: { InquilinoId: InquilinoId },
        include: [{ model: Inquilino }, { model: Setor }],
      });

      motoristaExists = MotoristaDTO.fromEntity(
        motoristaExists.get({ plain: true })
      );
      motoristaUpdated = MotoristaDTO.fromEntity(
        motoristaUpdated.get({ plain: true })
      );

      await LogSistema.setLogSistema(
        MotoristaDTO.toEntity(motoristaExists),
        MotoristaDTO.toEntity(motoristaUpdated),
        adminId,
        { ReferenciaId: motoristaId, ReferenciaTipo: "Motorista" }
      );

      return res.json({ message: "Motorista ativado" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteMotorista(req, res) {
    try {
      const { motoristaId } = req.params;
      const { adminId } = req.query;

      let motoristaExists = await Motorista.findByPk(motoristaId,{
        include: [
          { model: Setor },
          { model: Inquilino },
          { model: Viagem, as: "Viagens" },
        ],
      });

      
      if(!motoristaExists)
        return res.status(400).json({ erro: "Motorista não existe" });
      
      motoristaExists = MotoristaDTO.fromEntity(motoristaExists);
      
      if(motoristaExists.Viagens.length == 0){
        await Motorista.destroy({
          where: {
            MotoristaId: motoristaId,
          }
        });
        await Endereco.destroy({ 
          where: {
            ReferenciaId: motoristaId,
            ReferenciaTipo: "Motorista",
          },
        });
        await LogSistema.setDeleteLog(motoristaExists, adminId, { ReferenciaId: motoristaId, ReferenciaTipo: "Motorista" });
        return res.send("Excluído");
      } else
        return res.status(400).json({ erro: "Não pode ser excluído, pois existem viagens com este motorista"});

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new motoristaController();
