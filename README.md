# Academia

API REST acadêmica para gerenciamento de uma academia. O projeto utiliza Node.js, Fastify, Prisma ORM 7 e PostgreSQL hospedado no Neon. A modelagem existente contém sete entidades: Aluno, Instrutor, Plano, Contratacao, Exercicio, FichaTreino e ItemFicha.

## Requisitos

- Node.js 22 ou versão compatível com as dependências do projeto
- PostgreSQL/Neon configurado

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie `.env` na raiz, sem enviar esse arquivo ao Git:

   ```env
   DATABASE_URL="URL_POOLED_DO_NEON"
   DIRECT_URL="URL_DIRECT_DO_NEON"
   ```

3. Gere o Prisma Client e confira a conexão/migrations:

   ```bash
   npx prisma generate
   npx prisma migrate status
   ```

4. Inicie a API:

   ```bash
   npm run dev
   ```

O servidor escuta na porta `3000`. Use `GET http://localhost:3000/ping` para conferir se está ativo.

## Rotas

Todas as entidades oferecem `GET` de coleção, `GET /:id`, `POST`, `PUT /:id`, `PATCH /:id` e `DELETE /:id`.

| Entidade | Caminho base | Observação |
|---|---|---|
| Aluno | `/alunos` | E-mail único |
| Instrutor | `/instrutores` | E-mail único |
| Plano | `/planos` | Valor não negativo e duração positiva |
| Contratação | `/contratacoes` | Exige aluno e plano existentes; fim não pode anteceder início |
| Exercício | `/exercicios` | Nome obrigatório |
| Ficha de treino | `/fichas-treino` | Exige aluno e instrutor existentes |
| Item de ficha | `/itens-ficha` | Exige ficha e exercício existentes; séries, repetições e ordem positivas |

### Códigos HTTP

- `200`: consulta ou atualização concluída
- `201`: registro criado
- `204`: registro excluído
- `400`: ID, corpo ou valor inválido
- `404`: registro não encontrado
- `409`: e-mail duplicado, referência inválida ou exclusão bloqueada por relacionamento

Os corpos enviados devem ser JSON. IDs das relações devem referenciar registros existentes. `PUT` substitui os campos editáveis; `PATCH` altera apenas os campos enviados e rejeita corpo vazio.

## Testes no Thunder Client

Configure a URL base como `http://localhost:3000`. Para testar as relações, crie registros nesta ordem: aluno, instrutor, plano e exercício; depois contratação, ficha e item de ficha. Exclua na ordem inversa para respeitar as chaves estrangeiras.

Exemplo de aluno (`POST /alunos`):

```json
{
  "nome": "Aluno de teste",
  "email": "aluno.teste@example.com",
  "telefone": "11999999999"
}
```

Exemplo de plano (`POST /planos`):

```json
{
  "nome": "Mensal",
  "descricao": "Acesso à academia por 30 dias",
  "valor": 89.9,
  "duracao_dias": 30
}
```

Exemplo de contratação (`POST /contratacoes`), substituindo IDs por registros existentes:

```json
{
  "id_aluno": 1,
  "id_plano": 1,
  "data_inicio": "2026-12-01T10:00:00.000Z",
  "data_fim": "2026-12-31T10:00:00.000Z"
}
```

Repita GET, GET por ID, PUT, PATCH e DELETE para cada caminho da tabela. Verifique também e-mail repetido (409), datas fora de ordem (400), referências inexistentes (409), corpo vazio no PATCH (400) e IDs inexistentes (404). Use registros de teste próprios e remova-os ao terminar.

## Prisma e migrations

O schema Prisma está em `prisma/schema.prisma`; o Prisma Client gerado fica em `generated/prisma` e é ignorado pelo Git. A conexão usa o adaptador PostgreSQL em `src/lib/prisma.js`.

No Neon, `npx prisma migrate status` informou que as duas migrations estão aplicadas e `prisma migrate diff` confirmou que o schema está sincronizado. A revisão encontrou divergência no checksum da migration `20261118002946_init` e texto que não parece SQL nesse arquivo. Como ela consta aplicada no Neon, o histórico não foi reescrito.

### Inicializar um banco PostgreSQL vazio

`prisma/baseline.sql` é um snapshot SQL gerado do schema atual para bancos novos. Use estes passos **somente em um banco vazio** com as variáveis `DATABASE_URL` e `DIRECT_URL` configuradas para esse novo banco:

1. Criar as tabelas e relações do snapshot:

   ```bash
   npx prisma db execute --file prisma/baseline.sql
   ```

2. Registrar as migrations históricas como já aplicadas, pois o baseline já contém o schema resultante delas:

   ```bash
   npx prisma migrate resolve --applied 20261118002946_init
   npx prisma migrate resolve --applied 20261118003804_init
   ```

3. Confirmar a instalação:

   ```bash
   npx prisma migrate status
   npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code
   ```

Não execute o arquivo `baseline.sql` no Neon atual: ele já contém essas tabelas. Para alterações futuras, crie migrations novas e aplique-as normalmente; não sobrescreva o snapshot inicial nem as migrations históricas.

## Organização

- `src/routes/`: rotas HTTP por entidade
- `src/lib/schemas.js`: schemas de validação Fastify
- `src/lib/prisma.js`: conexão do Prisma Client com PostgreSQL
- `prisma/schema.prisma`: entidades e relacionamentos
- `prisma/migrations/`: histórico de migrations

`src/server.js` registra as sete rotas e inicia o Fastify.

