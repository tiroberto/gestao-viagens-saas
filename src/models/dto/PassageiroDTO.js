// src/dtos/PassageiroDTO.js
export default class PassageiroDTO {
  /**constructor(data) {
    this.PassageiroId = data.PassageiroId;
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
      PassageiroId: data.PassageiroId,
      Nome: data.Nome,
      CPF: data.CPF.replace(/[^a-zA-Z0-9 ]/g, ''),
      Telefone: data.Telefone,
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
      PassageiroId: entity.PassageiroId,
      Nome: entity.Nome,
      CPF: entity.CPF,
      Telefone: entity.Telefone,
      Ativo: entity.Ativo,
      Endereco: entity.Endereco ?? null,
      Viagens: entity.Viagens ?? [],
      Inquilino: entity.Inquilino,
    };
  }
}
