export default class EnderecoDTO {
  /*  
   * Converte dados recebidos da requisição para um objeto
   * que pode ser usado no create/update do Sequelize.
   */
  static toEntity(data) {
    return {
      EnderecoId: data.EnderecoId ?? null,
      Logradouro: data.Logradouro,
      Numero: data.Numero,
      Bairro: data.Bairro,
      Cidade: data.Cidade,
      EstadoUF: data.EstadoUF,
      CEP: data.CEP.replace(/[^a-zA-Z0-9 ]/g, ''),
      Complemento: data.Complemento ?? null,
      ReferenciaId: data.ReferenciaId,
      ReferenciaTipo: data.ReferenciaTipo,
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
      EnderecoId: entity.EnderecoId,    
      Logradouro: entity.Logradouro,
      Numero: entity.Numero,
      Bairro: entity.Bairro,
      Cidade: entity.Cidade,
      CEP: entity.CEP,
      Complemento: entity.Complemento ?? null,
      EstadoUF: entity.EstadoUF,
      ReferenciaId: entity.ReferenciaId,
      ReferenciaTipo: entity.ReferenciaTipo,
      Inquilino: entity.Inquilino,
    };
  }
}
