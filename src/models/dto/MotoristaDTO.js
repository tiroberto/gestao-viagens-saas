// src/dtos/MotoristaDTO.js
import Endereco from "../Endereco.js";
import Motorista from "../Motorista.js";

export default class MotoristaDTO {
  /**constructor(data) {
    this.MotoristaId = data.MotoristaId;
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
      MotoristaId: data.MotoristaId,
      Nome: data.Nome,
      Telefone: data.Telefone,
      CPF: data.CPF.replace(/[^a-zA-Z0-9 ]/g, ''),
      Email: data.Email,
      Senha: data.Senha,
      CNH: data.CNH,
      CategoriaCNH: data.CategoriaCNH,
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
      MotoristaId: entity.MotoristaId,
      Nome: entity.Nome,
      CPF: entity.CPF,
      Telefone: entity.Telefone,
      Email: entity.Email,
      Senha: entity.Senha,
      CNH: entity.CNH,
      CategoriaCNH: entity.CategoriaCNH,
      Ativo: entity.Ativo,
      Setor: entity.Setor,
      Endereco: entity.Endereco ?? null,
      Viagens: entity.Viagens ?? null,
      Inquilino: entity.Inquilino,
    };
  }
}
