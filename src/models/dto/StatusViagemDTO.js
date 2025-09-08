// src/dtos/StatusDTO.js
export default class StatusViagemDTO {
  /**  
   * Converte dados recebidos da requisição para um objeto
   * que pode ser usado no create/update do Sequelize.
   */
  static toEntity(data) {
    return {
      StatusViagemId: data.StatusViagemId ?? null,
      Descricao: data.Descricao,
    };
  }

  /**
   * Converte o objeto retornado pelo banco (Sequelize Model Instance)
   * em um JSON de resposta mais "limpo".
   */
  static fromEntity(entity) {
    if (!entity) return null;
    return {
      StatusViagemId: entity.StatusViagemId,
      Descricao: entity.Descricao,   
    };
  }
}
