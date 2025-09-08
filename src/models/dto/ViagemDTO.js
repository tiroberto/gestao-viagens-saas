import PassageiroViagemDTO from "./PassageiroViagemDTO.js";

// src/dtos/ViagemDTO.js
export default class ViagemDTO {
  /**constructor(data) {
    this.ViagemId = data.ViagemId;
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
      ViagemId: data.ViagemId,
      DataHora: new Date(Date.parse(data.DataHora)),
      CidadeDestino: data.CidadeDestino,
      TarefasExtras: data.TarefasExtras ?? "",
      CarroId: data.Carro.CarroId,
      AdministradorId: data.Administrador.AdministradorId,
      MotoristaId: data.Motorista.MotoristaId,
      StatusViagemId: !data.StatusViagem ? 1 : data.StatusViagem.StatusViagemId,//StatusViagemId=1 agendada
      SetorId: data.Setor.SetorId,
      InquilinoId: data.Inquilino.InquilinoId,
      Passageiros: data.Passageiros,
    };
  }

  /**
   * Converte o objeto retornado pelo banco (Sequelize Model Instance)
   * em um JSON de resposta mais "limpo".
   */
  static fromEntity(entity) {
    if (!entity) return null;
    return {
      ViagemId: entity.ViagemId,
      DataHora: entity.DataHora,
      CidadeDestino: entity.CidadeDestino,
      TarefasExtras: entity.TarefasExtras ?? "",
      Carro: entity.Carro,
      Administrador: entity.Administrador,
      Motorista: entity.Motorista,
      StatusViagem: entity.StatusViagem,
      Setor: entity.Setor,
      Inquilino: entity.Inquilino,
      Passageiros: entity.Passageiros.map(p => PassageiroViagemDTO.fromEntity(p)),
    };
  }
}

