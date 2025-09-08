// src/dtos/LocalDTO.js
export default class LocalDTO {
  /*
   * Converte dados recebidos da requisição para um objeto
   * que pode ser usado no create/update do Sequelize.
   */
  static toEntity(data) {
    return {
      LocalId: data.LocalId ?? null,
      Descricao: data.Descricao,
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
      LocalId: entity.LocalId,
      Descricao: entity.Descricao,
      Ativo: entity.Ativo,
      Endereco: entity.Endereco ?? null,
      Inquilino: entity.Inquilino,      
    };
  }
}
