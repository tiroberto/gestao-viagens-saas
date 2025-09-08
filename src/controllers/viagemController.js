import Viagem from "../models/Viagem.js";
import PassageiroViagem from "../models/PassageiroViagem.js";
import StatusViagem from "../models/StatusViagem.js";
import Motorista from "../models/Motorista.js";
import Carro from "../models/Carro.js";
import Passageiro from "../models/Passageiro.js";
import Administrador from "../models/Administrador.js";
import Setor from "../models/Setor.js";
import Inquilino from "../models/Inquilino.js";
import LogSistema from "../models/LogSistema.js";
import ViagemDTO from "../models/dto/ViagemDTO.js";

class viagemController {
  async getViagens(req, res) {
    try {
      const { inquilinoId } = req.query;
      const { adminId, carroId, setorId, motoristaId, passageiroId } = req.query;

      if (adminId) {
        const viagensExists = await Viagem.findAll({
          where: {
            InquilinoId: inquilinoId,
            AdministradorId: adminId,
          },
          include: [
            Carro,
            Administrador,
            { model: Motorista, as: "Motorista" },
            StatusViagem,
            { model: Passageiro, as: "Passageiros" },
            Setor,
            Inquilino,
          ],
        });

        if (!(viagensExists.length > 0))
          return res.status(400).json({ error: "Viagens não existentes" });

        let viagens = [];
        viagensExists.forEach((viagem) =>
          viagens.push(ViagemDTO.fromEntity(viagem))
        );
        return res.json(viagens);
      } else if (carroId) {
        const viagensExists = await Viagem.findAll({
          where: {
            InquilinoId: inquilinoId,
            CarroId: carroId,
          },
          include: [
            Carro,
            Administrador,
            { model: Motorista, as: "Motorista" },
            StatusViagem,
            { model: Passageiro, as: "Passageiros" },
            Setor,
            Inquilino,
          ],
        });

        if (!(viagensExists.length > 0))
          return res.status(400).json({ error: "Viagens não existentes" });

        let viagens = [];
        viagensExists.forEach((viagem) =>
          viagens.push(ViagemDTO.fromEntity(viagem))
        );
        return res.json(viagens);
      } else if (setorId) {
        const viagensExists = await Viagem.findAll({
          where: {
            InquilinoId: inquilinoId,
            SetorId: setorId,
          },
          include: [
            Carro,
            Administrador,
            { model: Motorista, as: "Motorista" },
            StatusViagem,
            { model: Passageiro, as: "Passageiros" },
            Setor,
            Inquilino,
          ],
        });

        if (!(viagensExists.length > 0))
          return res.status(400).json({ error: "Viagens não existentes" });

        let viagens = [];
        viagensExists.forEach((viagem) =>
          viagens.push(ViagemDTO.fromEntity(viagem))
        );
        return res.json(viagens);
      } else if (motoristaId) {
        const viagensExists = await Viagem.findAll({
          where: {
            InquilinoId: inquilinoId,
            MotoristaId: motoristaId,
          },
          include: [
            Carro,
            Administrador,
            { model: Motorista, as: "Motorista" },
            StatusViagem,
            { model: Passageiro, as: "Passageiros" },
            Setor,
            Inquilino,
          ],
        });

        if (!(viagensExists.length > 0))
          return res.status(400).json({ error: "Viagens não existentes" });

        let viagens = [];
        viagensExists.forEach((viagem) =>
          viagens.push(ViagemDTO.fromEntity(viagem))
        );
        return res.json(viagens);
      } else if (passageiroId) {
        const viagensExists = await Viagem.findAll({
          where: {
            InquilinoId: inquilinoId,            
          },
          include: [
            Carro,
            Administrador,
            { model: Motorista, as: "Motorista" },
            StatusViagem,
            { model: Passageiro, as: "Passageiros", through: { where: { PassageiroId: passageiroId }} },
            Setor,
            Inquilino,
          ],
        });

        if (!(viagensExists.length > 0))
          return res.status(400).json({ error: "Viagens não existentes" });

        let viagens = [];
        viagensExists.forEach((viagem) =>
          viagens.push(ViagemDTO.fromEntity(viagem))
        );
        return res.json(viagens);
      } else {
        const viagensExists = await Viagem.findAll({
          where: {
            InquilinoId: inquilinoId,
          },
          include: [
            Carro,
            Administrador,
            { model: Motorista, as: "Motorista" },
            StatusViagem,
            { model: Passageiro, as: "Passageiros" },
            Setor,
            Inquilino,
          ],
        });

        if (!(viagensExists.length > 0))
          return res.status(400).json({ error: "Viagens não encontradas" });

        let viagens = [];
        viagensExists.forEach((viagem) =>
          viagens.push(ViagemDTO.fromEntity(viagem))
        );
        return res.json(viagens);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getViagemByPk(req, res) {
    try {
      const { viagemId } = req.params;
      const viagem = await Viagem.findByPk(viagemId, {
        include: [
          Carro,
          Administrador,
          { model: Motorista, as: "Motorista" },
          StatusViagem,
          { model: Passageiro, as: "Passageiros" },
          Setor,
          Inquilino,
        ],
      });

      if (viagem) return res.json(ViagemDTO.fromEntity(viagem));
      else return res.status(400).json({ error: "Viagem não encontrada" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createViagem(req, res) {
    try {
      const viagemEntidade = ViagemDTO.toEntity(req.body);

      if (Viagem.validateViagem(viagemEntidade)) {
        let viagem = await Viagem.create(viagemEntidade);

        if (viagem) {
          let passageiros = await Viagem.addPassageiros(
            viagemEntidade.Passageiros,
            viagem
          );

          if (passageiros) {
            let viagemCreated = await Viagem.findByPk(viagem.ViagemId, {
              where: {
                InquilinoId: viagem.InquilinoId,
              },
              include: [
                Carro,
                Administrador,
                { model: Motorista, as: "Motorista" },
                StatusViagem,
                { model: Passageiro, as: "Passageiros" },
                Setor,
                Inquilino,
              ],
            });

            return res.json(viagemCreated);
          }
        } else return res.status(400).json({ error: "Erro ao criar viagem" });
      } else res.status(400).json({ erro: "Erro na validação" });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          errors: error.errors, // lista de mensagens de erro
        });
      }
      console.log(error);
      res.status(500).json({ error: error.message, errorname: error.name });
    }
  }

  async updateViagem(req, res) {
    try {
      const viagemEntidade = ViagemDTO.toEntity(req.body);

      if (Viagem.validateViagem(viagemEntidade)) {
        const { viagemId } = req.params;
        const { adminId } = req.query;

        let viagemExists = await Viagem.findByPk(viagemId, {
          include: [
            Carro,
            Administrador,
            { model: Motorista, as: "Motorista" },
            StatusViagem,
            { model: Passageiro, as: "Passageiros" },
            Setor,
            Inquilino,
          ],
        });

        if (!viagemExists)
          return res.status(400).json({ error: "Viagem não existe" });

        //console.log(viagemEntidade);
        await Viagem.update(viagemEntidade, { where: { ViagemId: viagemId } });

        //await LogSistema.setLogSistema(viagemExists.get({ plain: true}), viagem, { referenciaId: viagemExists.ViagemId, referenciaTipo: "Viagem" });

        if (
          viagemEntidade.Passageiros.length > viagemExists.Passageiros.length
        ) {
          let passageiroViagemToCreate = viagemEntidade.Passageiros.filter(
            (passageiro) =>
              !viagemExists.Passageiros.some(
                (passageiroCadastrado) =>
                  passageiroCadastrado.PassageiroId == passageiro.PassageiroId
              )
          );
          await Viagem.addPassageiros(passageiroViagemToCreate, viagemExists);
        } else if (
          viagemEntidade.Passageiros.length < viagemExists.Passageiros.length
        ) {
          let passageiroViagemToRemove = viagemExists.Passageiros.filter(
            (passageiro) =>
              !viagemEntidade.Passageiros.some(
                (passageiroCadastrado) =>
                  passageiroCadastrado.PassageiroId == passageiro.PassageiroId
              )
          );
          await Viagem.removePassageiros(
            passageiroViagemToRemove,
            viagemExists
          );
        }

        let viagemUpdated = await Viagem.findByPk(viagemId, {
          include: [
            Carro,
            Administrador,
            { model: Motorista, as: "Motorista" },
            { model: Passageiro, as: "Passageiros" },
            StatusViagem,
            Setor,
            Inquilino,
          ],
        });

        viagemExists = ViagemDTO.fromEntity(viagemExists.get({ plain: true }));
        viagemUpdated = ViagemDTO.fromEntity(
          viagemUpdated.get({ plain: true })
        );
        //console.log(viagemExists.Passageiros);
        await LogSistema.setLogSistema(
          ViagemDTO.toEntity(viagemExists),
          ViagemDTO.toEntity(viagemUpdated),
          adminId,
          { ReferenciaId: viagemId, ReferenciaTipo: "Viagem" }
        );

        return res.json(viagemUpdated);
      } else res.status(400).json({ erro: "Erro na validação" });
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

  async deleteViagem(req, res) {
    try {
      const { viagemId } = req.params;
      const { adminId } = req.query;
      let viagem = await Viagem.findByPk(viagemId, {
        include: [
          StatusViagem,
          Administrador,
          Carro,
          { model: Motorista, as: "Motorista" },
          { model: Passageiro, as: "Passageiros" },
          Inquilino,
          Setor,
        ],
      });

      if (!viagem) return res.status(400).json({ error: "Viagem não existe" });

      viagem = ViagemDTO.fromEntity(viagem);

      await PassageiroViagem.destroy({
        where: {
          ViagemId: viagemId,
        },
      })
        .then((data) => console.log("Passageiros excluídos"))
        .catch((err) => console.log(err));

      await Viagem.destroy({
        where: {
          ViagemId: viagemId,
        },
      })
        .then((data) => console.log("Viagem excluída"))
        .catch((err) => console.log(err));

      await LogSistema.setDeleteLog(viagem, adminId, {
        ReferenciaId: viagemId,
        ReferenciaTipo: "Viagem",
      });

      return res.json({ message: "Viagem excluída" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new viagemController();
