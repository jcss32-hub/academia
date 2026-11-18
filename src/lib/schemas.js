export const idSchema = {
  type: "object",
  required: ["id"],
  additionalProperties: false,
  properties: {
    id: {
      type: "integer",
      minimum: 1,
    },
  },
};

// Campos permitidos para cadastrar um aluno
export const camposAluno = {
  nome: {
    type: "string",
    minLength: 1,
  },
  email: {
    type: "string",
    format: "email",
  },
  telefone: {
    type: "string",
    minLength: 8,
  },
};

// Cadastro completo
export const alunoCompleto = {
  type: "object",
  additionalProperties: false,
  required: ["nome", "email"],
  properties: camposAluno,
};

// Atualização parcial
export const alunoParcial = {
  type: "object",
  additionalProperties: false,
  minProperties: 1,
  properties: camposAluno,
};
