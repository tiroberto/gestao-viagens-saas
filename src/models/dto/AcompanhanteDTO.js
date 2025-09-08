// src/dtos/AcompanhanteDTO.js
import Acompanhante from "../Acompanhante.js";
import Endereco from "../Endereco.js";

export default class AcompanhanteDTO {
  /**constructor(data) {
    this.AcompanhanteId = data.AcompanhanteId;
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
      AcompanhanteId: data.AcompanhanteId ?? null,
      Nome: data.Nome,
      Telefone: data.Telefone,
      CPF: data.CPF.replace(/[^a-zA-Z0-9 ]/g, ''),
      Ativo: data.Ativo,
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
      AcompanhanteId: entity.AcompanhanteId,
      Nome: entity.Nome,
      CPF: entity.CPF,
      Telefone: entity.Telefone,
      Ativo: entity.Ativo,
      Endereco: entity.Endereco ?? null,
      Viagens: entity.Viagens ?? null,
      Inquilino: entity.Inquilino,
    };
  }
}
