import Carro from "../models/Carro.js";
import CarroDTO from "../models/dto/CarroDTO.js";
import Inquilino from "../models/Inquilino.js";
import Endereco from "../models/Endereco.js";
import LogSistema from "../models/LogSistema.js";
import Viagem from "../models/Viagem.js";
import Setor from "../models/Setor.js";
import { Op } from "sequelize";

class carroController {
  async getCarros(req, res) {
    try {
      const { inquilinoId } = req.query
      const { tipoCombustivel, placa, setorId } = req.query;

      if (tipoCombustivel) {
        let carrosExists = await Carro.findAll({
          where: {
            InquilinoId: inquilinoId,
            TipoCombustivel: {
              [Op.substring]: tipoCombustivel,
            },
          },
          include: [{ model: Inquilino }, { model: Setor }],
        });

        if (carrosExists.length > 0) {
          let carros = carrosExists.map((carro) =>
            CarroDTO.fromEntity(carro)
          );
          return res.json(carros);
        } else res.status(400).json({ error: "Carros não encontrados" });
      } else if (placa){
        let carrosExists = await Carro.findAll({
          where: {
            InquilinoId: inquilinoId,
            Placa: {
              [Op.substring]: placa,
            },
          },
          include: [{ model: Inquilino }, { model: Viagem, as: "Viagens" }, { model: Setor }],
        });

        if (carrosExists.length > 0) {
          let carros = carrosExists.map((carro) =>
            CarroDTO.fromEntity(carro)
          );
          return res.json(carros);
        } else res.status(400).json({ error: "Carros não encontrados" });
      } else if (setorId){
        let carrosExists = await Carro.findAll({
          where: {
            InquilinoId: inquilinoId,
            SetorId: setorId,
          },
          include: [{ model: Inquilino }, { model: Setor }],
        });

        if (carrosExists.length > 0) {
          let carros = carrosExists.map((carro) =>
            CarroDTO.fromEntity(carro)
          );
          return res.json(carros);
        } else res.status(400).json({ error: "Carros não encontrados" });
      } else {
        let carrosExists = await Carro.findAll({
          where: {
            InquilinoId: inquilinoId,
            Ativo: true,
          },
          include: [{ model: Inquilino }, { model: Setor }],
        });
        if (carrosExists.length > 0) {
          let carros = carrosExists.map((carro) =>
            CarroDTO.fromEntity(carro)
          );
          return res.json(carros);
        } else res.status(400).json({ error: "Carros não encontrados" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCarrosInativos(req, res) {
    try {
      const { inquilinoId } = req.query
      const carros = await Carro.findAll({
        where: {
          InquilinoId: inquilinoId,
          Ativo: false,
        },
        include: [{ model: Inquilino }, { model: Setor }],
      });

      if (carros.length > 0) {
        carros.forEach((carro) =>
          CarroDTO.fromEntity(carro)
        );
        return res.json(carros);
      } else res.status(400).json({ error: "Carros não encontrados" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getCarroByPk(req, res) {
    try {
      const { carroId } = req.params;
      const carro = await Carro.findByPk(carroId, {
        include: [{ model: Inquilino }, { model: Viagem, as: "Viagens" }, { model: Setor }],
      });
      if (!carro)
        return res.status(400).json({ error: "Carro não existe" });

      return res.json(CarroDTO.fromEntity(carro));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createCarro(req, res) {
    try {
      const carroEntidade = CarroDTO.toEntity(req.body);

      if (Carro.validateCarro(carroEntidade)) {
        const { InquilinoId } = carroEntidade;

        const carroExists = await Carro.findOne({
          where: {
            InquilinoId: InquilinoId,
            Placa: carroEntidade.Placa,
          },
        });

        //let carro = req.body;
        //carro.InquilinoId = req.body.Inquilino.InquilinoId;

        if (carroExists)
          return res.status(400).json({ error: "Carro já existe" });

        const carro = await Carro.create(carroEntidade);
        return res.json(carro);
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

  async updateCarro(req, res) {
    try {
      const carroEntidade = CarroDTO.toEntity(req.body);

      if (Carro.validateCarro(carroEntidade)) {
        const { carroId } = req.params;
        const { adminId } = req.query;
        const { InquilinoId } = carroEntidade;

        let carroExists = await Carro.findByPk(carroId, {
          include: [{ model: Inquilino }, { model: Setor }],
        });

        if (carroEntidade.Placa != carroExists.Placa) {
          const carro = await Carro.findOne({
            where: {
              InquilinoId: InquilinoId,
              Placa: carroEntidade.Placa,
            },
          });

          if (carro)
            return res.status(400).json({ error: "Carro com esta placa já existe" });
        }

        await Carro.update(carroEntidade, {
          where: { CarroId: carroId },
        });

        let carroUpdated = await Carro.findByPk(carroId, {
          include: [{ model: Inquilino }, { model: Setor }],
        });

        carroExists = CarroDTO.fromEntity(carroExists.get({ plain: true }));
        carroUpdated = CarroDTO.fromEntity(carroUpdated.get({ plain: true }));

        await LogSistema.setLogSistema(
          CarroDTO.toEntity(carroExists),
          CarroDTO.toEntity(carroUpdated),
          adminId,
          { ReferenciaId: carroId, ReferenciaTipo: "Carro" }
        );

        return res.json(carroUpdated);
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

  async inactivateCarro(req, res) {
    try {
      const { carroId } = req.params;
      const { adminId } = req.query;
      const { inquilinoId } = req.query

      var carroExists = await Carro.findByPk(carroId, {
        where: { InquilinoId: InquilinoId },
        include: [{ model: Inquilino }, { model: Setor }],
      });

      if (!carroExists)
        return res.status(400).json({ error: "Carro não existe" });

      await Carro.update(
        { Ativo: false },
        { where: { CarroId: carroId } }
      );

      let carroUpdated = await Carro.findByPk(carroId, {
        where: { InquilinoId: InquilinoId },
        include: [{ model: Inquilino }, { model: Setor }],
      });

      carroExists = CarroDTO.fromEntity(carroExists.get({ plain: true }));
      carroUpdated = CarroDTO.fromEntity(carroUpdated.get({ plain: true }));

      await LogSistema.setLogSistema(
        CarroDTO.toEntity(carroExists),
        CarroDTO.toEntity(carroUpdated),
        adminId,
        { ReferenciaId: carroId, ReferenciaTipo: "Carro" }
      );

      return res.json({ message: "Carro inativado" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  async activateCarro(req, res) {
    try {
      const { carroId } = req.params;
      const { adminId } = req.query;
      const { inquilinoId } = req.query

      var carroExists = await Carro.findByPk(carroId, {
        where: { InquilinoId: InquilinoId },
        include: [{ model: Inquilino }, { model: Setor }],
      });

      if (!carroExists)
        return res.status(400).json({ error: "Carro não existe" });

      await Carro.update(
        { Ativo: true },
        { where: { CarroId: carroId } }
      );

      let carroUpdated = await Carro.findByPk(carroId, {
        where: { InquilinoId: InquilinoId },
        include: [{ model: Inquilino }, { model: Setor }],
      });
      carroExists = CarroDTO.fromEntity(
        carroExists.get({ plain: true })
      );
      carroUpdated = CarroDTO.fromEntity(
        carroUpdated.get({ plain: true })
      );

      await LogSistema.setLogSistema(
        CarroDTO.toEntity(carroExists),
        CarroDTO.toEntity(carroUpdated),
        adminId,
        { ReferenciaId: carroId, ReferenciaTipo: "Carro" }
      );

      return res.json({ message: "Carro ativado" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteCarro(req, res) {
    try {
      const { carroId } = req.params;
      const { adminId } = req.query;

      let carroExists = await Carro.findByPk(carroId, {
        include: [{ model: Inquilino }, { model: Viagem, as: "Viagens" }, { model: Setor }],
      });
      
      if (!carroExists)
        return res.status(400).json({ erro: "Carro não existe" });
      
      carroExists = CarroDTO.fromEntity(carroExists);

      if(!(carroExists.Viagens.length > 0)){
        await Carro.destroy({
          where: {
            CarroId: carroId,
          },
        })
          .then((data) => console.log("Carro excluído"))
          .catch((err) => console.log(err));
          
        await LogSistema.setDeleteLog(carroExists, adminId, {
          ReferenciaId: carroId,
          ReferenciaTipo: "Carro",
        });
    
        return res.send("Excluído");
      } else
          return res.status(400).json({ erro: "Este carro possui viagens registradas" });
      } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new carroController();
