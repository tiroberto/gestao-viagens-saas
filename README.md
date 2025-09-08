## Projeto: Gestão de Viagens – API (SaaS) ##

## API RESTful desenvolvida em Node.js, com Sequelize e Express, ideal para gerenciar viagens de um departamento de transporte municipal, pensada como solução multi-tenant (SaaS).

## Funcionalidades principais:
* CRUD completo para entidades como Motorista, Paciente, Viagem, Carro, Status, Administrador, entre outras.
* Suporte a multi-tenancy por InquilinoId, permitindo que múltiplos municípios utilizem a mesma instância com isolamento de dados.
* Autenticação com roles diferenciadas (Administrador e Motorista), utilizando bcrypt e JWT (JSON Web Tokens).
* Associações complexas entre entidades, como M:N entre Viagem e Passageiro, com gerenciamento de atributos na tabela through.
* Registro de logs de auditoria (mudanças) via model LogSistema com comparação de estados antes/depois.

## Tecnologias usadas:
* Node.js com Express como estrutura de API.
* Sequelize para ORM com suporte a principais bancos relacionais.
* bcrypt para hashing seguro de senhas.
* jsonwebtoken para autenticação de rotas via token JWT.
* Estrutura modular com Models utilizando classes e associate() para relações.

## Funcionalidades SaaS destacadas:
* Multi-tenant: utiliza InquilinoId em todas as entidades, garantindo isolamento de dados por cliente.
* Roles & permissões: usuários logam sem passar tipo do usuário, o sistema identifica se é Administrador ou Motorista e inclui role no JWT.
