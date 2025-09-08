// src/dtos/PassageiroViagemDTO.js
export default class PassageiroViagemDTO {
  /**constructor(data) {
    this.PassageiroViagemId = data.PassageiroViagemId;
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
      MotivoViagem: data.MotivoViagem,
      PontoEmbarqueId: data.PontoEmbarqueId,
      AcompanhanteId: !data.Acompanhante ? null : data.Acompanhante.AcompanhanteId,
      InquilinoId: data.InquilinoId,      
    };
  }

  /**
   * Converte o objeto retornado pelo banco (Sequelize Model Instance)
   * em um JSON de resposta mais "limpo".
   */
  static fromEntity(entity) {
    if (!entity) return null;
    return {
      ViagemId: entity.PassageiroViagem.ViagemId,
      PassageiroId: entity.PassageiroViagem.PassageiroId,
      MotivoViagem: entity.PassageiroViagem.MotivoViagem,
      PontoEmbarqueId: entity.PassageiroViagem.PontoEmbarqueId,
      AcompanhanteId: entity.PassageiroViagem.AcompanhanteId,
      InquilinoId: entity.PassageiroViagem.InquilinoId,
    };
  }
}

