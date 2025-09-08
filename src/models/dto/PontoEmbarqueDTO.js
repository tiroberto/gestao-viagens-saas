// src/dtos/PontoEmbarqueDTO.js
export default class PontoEmbarqueDTO {
  /**  
   * Converte dados recebidos da requisição para um objeto
   * que pode ser usado no create/update do Sequelize.
   */
  static toEntity(data) {
    return {
      PontoEmbarqueId: data.PontoEmbarqueId ?? null,
      Descricao: data.Descricao,
      Cidade: data.Cidade,
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
      PontoEmbarqueId: entity.PontoEmbarqueId,
      Descricao: entity.Descricao,
      Cidade: entity.Cidade,
      Inquilino: entity.Inquilino,      
    };
  }
}
