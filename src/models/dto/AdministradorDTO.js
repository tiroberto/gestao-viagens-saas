// src/dtos/AdministradorDTO.js
import Endereco from "../Endereco.js";
import Administrador from "../Administrador.js";

export default class AdministradorDTO {
  /**constructor(data) {
    this.AdministradorId = data.AdministradorId;
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
      AdministradorId: data.AdministradorId ?? null,
      Nome: data.Nome,
      CPF: data.CPF.replace(/[^a-zA-Z0-9 ]/g, ''),
      Telefone: data.Telefone,
      Email: data.Email,
      Senha: data.Senha,
      Cargo: data.Cargo,
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
      AdministradorId: entity.AdministradorId,
      Nome: entity.Nome,
      CPF: entity.CPF,
      Telefone: entity.Telefone,
      Email: entity.Email,
      Senha: entity.Senha,
      Cargo: entity.Cargo,
      Ativo: entity.Ativo,
      Setor: entity.Setor,
      Endereco: entity.Endereco ?? null,
      Inquilino: entity.Inquilino,
      Viagens: entity.Viagens ?? [],
      LogsSistema: entity.LogsSistema ?? [],
    };
  }
}
