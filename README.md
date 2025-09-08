## Projeto: Gestão de Viagens – API (SaaS) ##

## API RESTful desenvolvida em Node.js, com Sequelize e Express, ideal para gerenciar viagens de um departamento de transporte municipal, pensada como solução multi-tenant (SaaS).

---

## 🚀 Funcionalidades principais:
* ✅ CRUD completo para entidades como Motorista, Paciente, Viagem, Carro, Status, Administrador, entre outras.
* ✅ Suporte a multi-tenancy por InquilinoId, permitindo que múltiplos municípios utilizem a mesma instância com isolamento de dados.
* ✅ Autenticação com roles diferenciadas (Administrador e Motorista), utilizando bcrypt e JWT (JSON Web Tokens).
* ✅ Associações complexas entre entidades, como M:N entre Viagem e Passageiro, com gerenciamento de atributos na tabela through.
* ✅ Registro de logs de auditoria (mudanças) via model LogSistema com comparação de estados antes/depois.

---

## 🔧 Tecnologias usadas:
* **Node.js** com **Express** como estrutura de API.
* **Sequelize** para ORM com suporte a principais bancos relacionais.
* Banco de dados **SQLite3**.
* **bcrypt** para hashing seguro de senhas.
* **jsonwebtoken** para autenticação de rotas via token JWT.
* Estrutura modular com Models utilizando classes e associate() para relações.

---

## 🧰 Funcionalidades SaaS destacadas:
* Multi-tenant: utiliza InquilinoId em todas as entidades, garantindo isolamento de dados por cliente.
* Roles & permissões: usuários logam sem passar tipo do usuário, o sistema identifica se é Administrador ou Motorista e inclui role no JWT.

---

## 📁 Estrutura do projeto:
```
src/
├── controllers/
│   ├── AuthController.js
│   ├── ViagemController.js
│   └── ...
├── models/
│   ├── dto/
│      ├── ViagemDTO.js
│      ├── MotoristaDTO.js
│      └── ...
│   ├── Viagem.js
│   ├── Motorista.js
│   └── ...
├── middlewares/
│   ├── authorize.js
│   └── associate.js (init + associate)
├── utils/
│   ├── cpfValidator.js
└── config/
    └── db.js
```

---

## 🧪 Como Rodar Localmente:

1. Clone o repositório:

   ```bash
   git clone https://github.com/tiroberto/gestao-viagens-saas
   ```

2. Acesse a pasta:

   ```bash
   cd gestao-viagens-saas
   ```

3. Restaure os pacotes:

   ```bash
   npm install
   ```

4. No arquivo authorize altere a secret key:
   
    ```js
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "o<sGH8?@Rc8hZE%0FD9&nm-*?Bb0l$");
    ```

5. Execute a aplicação:

   ```bash
   npm run dev
   ```

6. Login para testes:
Rota: localhost:3000/login

   ```json
   {
     "email": "admin@admin.com",
     "senha": "admin123",
   }
   ```

---

## 📄 Exemplos de Requisição JSON:

### 🔹 Criar uma viagem: /viagem (método post)
Deve-se adicionar o token de autenticação no header da requisição

```json
{
    "DataHora": "2026-03-18T10:00:00-03:00",
    "CidadeDestino": "São Paulo-MG",
    "TarefasExtras": "Pegar pasta de documentos",
    "Carro": { "CarroId": 1 },
    "Motorista": { "MotoristaId": 1 },
    "Administrador": { "AdministradorId": 1 },
    "Setor": { "SetorId": 1 },
    "Passageiros": [
        {
            "PassageiroId": 1,
            "MotivoViagem": "Consulta",
            "AcompanhanteId": 1,
            "PontoEmbarqueId": 1,
            "InquilinoId": 1
        },
        {
            "PassageiroId": 3,
            "MotivoViagem": "Exame",
            "PontoEmbarqueId": 1,
            "AcompanhanteId": 2,
            "InquilinoId": 1            
        },
        {
            "PassageiroId": 4,
            "MotivoViagem": "Exame",
            "PontoEmbarqueId": 1,
            "AcompanhanteId": null,
            "InquilinoId": 1            
        }
    ],
    "StatusViagem": null, --> O próprio sistema insere com status "Agendado"
    "Inquilino": { "InquilinoId": 1 }
}
```

---

## ✍️ Autor

Desenvolvido por **Humberto Júnior** – entre em contato comigo pelo [LinkedIn](https://linkedin.com/in/humbertoecrjunior)!

