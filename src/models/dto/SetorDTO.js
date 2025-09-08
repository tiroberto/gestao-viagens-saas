// src/dtos/SetorDTO.js
export default class SetorDTO {
  /**  
   * Converte dados recebidos da requisição para um objeto
   * que pode ser usado no create/update do Sequelize.
   */
  static toEntity(data) {
    return {
      SetorId: data.SetorId ?? null,
      Nome: data.Nome,
      Ativo: data.Ativo,
      AdministradorId: data.Administrador.AdministradorId,
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
      SetorId: entity.SetorId,
      Nome: entity.Nome,
      Ativo: entity.Ativo,
      Administrador: entity.Administrador,
      Inquilino: entity.Inquilino,      
    };
  }
}
