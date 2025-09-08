// src/dtos/CarroDTO.js
import Carro from "../Carro.js";
import Endereco from "../Endereco.js";

export default class CarroDTO {
  /**constructor(data) {
    this.CarroId = data.CarroId;
    this.Nome = data.Nome;
    this.Telefone = data.Telefone;
    this.CPF = data.CPF;
    this.InquilinoId = data.InquilinoId;
  }

  
   * Converte dados recebidos da requisição para um objeto
   * que pode ser usado no create/update do Sequelize.
   */
  static toEntity(data) {
    return {
      CarroId: data.CarroId ?? null,
      Nome: data.Nome,
      Placa: data.Placa,
      TipoCombustivel: data.TipoCombustivel,
      Ativo: data.Ativo,
      SetorId: data.Setor.SetorId,
      InquilinoId: data.Inquilino.InquilinoId,
    };
  }

  /**
   * Converte o objeto retornado pelo banco (Sequelize Model Instance)
   * em um JSON de resposta mais "limpo".
   */
  static fromEntity(entity) {
    if (!entity) return null;
    return {
      CarroId: entity.CarroId,
      Nome: entity.Nome,
      Placa: entity.Placa,
      TipoCombustivel: entity.TipoCombustivel,
      Ativo: entity.Ativo,
      Setor: entity.Setor,      
      Viagens: entity.Viagens,
      Inquilino: entity.Inquilino,      
    };
  }
}
