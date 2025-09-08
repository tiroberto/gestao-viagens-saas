export default class LogSistemaDTO {
  /**
   * Converte o objeto retornado pelo banco (Sequelize Model Instance)
   * em um JSON de resposta mais "limpo".
   */
  static fromEntity(entity) {
    if (!entity) return null;
    return {
      LogSistemaId: entity.LogSistemaId,    
      CampoAlterado: entity.CampoAlterado,
      ValorAntigo: entity.ValorAntigo,
      ValorNovo: entity.ValorNovo,
      ReferenciaId: entity.ReferenciaId,
      ReferenciaTipo: entity.ReferenciaTipo,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      Administrador: entity.Administrador,
      Inquilino: entity.Inquilino,
    };
  }
}
