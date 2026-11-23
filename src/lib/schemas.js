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

// Campos permitidos para cadastrar um instrutor
export const camposInstrutor = {
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
export const instrutorCompleto = {
  type: "object",
  additionalProperties: false,
  required: ["nome", "email"],
  properties: camposInstrutor,
};

// Atualização parcial
export const instrutorParcial = {
  type: "object",
  additionalProperties: false,
  minProperties: 1,
  properties: camposInstrutor,
};

// Campos permitidos para cadastrar um plano
export const camposPlano = {
  nome: {
    type: "string",
    minLength: 1,
  },
  descricao: {
    type: "string",
  },
  valor: {
    type: "number",
    minimum: 0,
  },
  duracao_dias: {
    type: "integer",
    minimum: 1,
  },
  ativo: {
    type: "boolean",
  },
};

// Cadastro completo
export const planoCompleto = {
  type: "object",
  additionalProperties: false,
  required: ["nome", "valor", "duracao_dias"],
  properties: camposPlano,
};

// Atualização parcial
export const planoParcial = {
  type: "object",
  additionalProperties: false,
  minProperties: 1,
  properties: camposPlano,
};


// Campos permitidos para uma contratação. Os IDs apontam para Aluno e Plano.
export const camposContratacao = {
  id_aluno: { type: "integer", minimum: 1 },
  id_plano: { type: "integer", minimum: 1 },
  data_inicio: { type: "string", format: "date-time" },
  data_fim: { type: "string", format: "date-time" },
  status: { type: "string", minLength: 1 },
};

// Cadastro e substituição completos
export const contratacaoCompleta = {
  type: "object",
  additionalProperties: false,
  required: ["id_aluno", "id_plano", "data_inicio", "data_fim"],
  properties: camposContratacao,
};

// Atualização parcial
export const contratacaoParcial = {
  type: "object",
  additionalProperties: false,
  minProperties: 1,
  properties: camposContratacao,
};


// Campos permitidos para cadastrar ou atualizar um exercício
export const camposExercicio = {
  nome: { type: "string", minLength: 1 },
  descricao: { type: "string" },
  grupo_muscular: { type: "string", minLength: 1 },
  ativo: { type: "boolean" },
};

// Cadastro e substituição completos
export const exercicioCompleto = {
  type: "object",
  additionalProperties: false,
  required: ["nome"],
  properties: camposExercicio,
};

// Atualização parcial
export const exercicioParcial = {
  type: "object",
  additionalProperties: false,
  minProperties: 1,
  properties: camposExercicio,
};


// Campos permitidos para cadastrar ou atualizar uma ficha de treino
export const camposFichaTreino = {
  id_aluno: { type: "integer", minimum: 1 },
  id_instrutor: { type: "integer", minimum: 1 },
  nome: { type: "string", minLength: 1 },
  observacoes: { type: "string" },
};

// Cadastro e substituição completos
export const fichaTreinoCompleta = {
  type: "object",
  additionalProperties: false,
  required: ["id_aluno", "id_instrutor", "nome"],
  properties: camposFichaTreino,
};

// Atualização parcial
export const fichaTreinoParcial = {
  type: "object",
  additionalProperties: false,
  minProperties: 1,
  properties: camposFichaTreino,
};


// Campos permitidos para cadastrar ou atualizar um item de ficha
export const camposItemFicha = {
  id_ficha: { type: "integer", minimum: 1 },
  id_exercicio: { type: "integer", minimum: 1 },
  series: { type: "integer", minimum: 1 },
  repeticoes: { type: "integer", minimum: 1 },
  carga_recomendada: { type: ["number", "null"], minimum: 0 },
  ordem: { type: "integer", minimum: 1 },
};

// Cadastro e substituição completos
export const itemFichaCompleto = {
  type: "object",
  additionalProperties: false,
  required: ["id_ficha", "id_exercicio", "series", "repeticoes", "ordem"],
  properties: camposItemFicha,
};

// Atualização parcial
export const itemFichaParcial = {
  type: "object",
  additionalProperties: false,
  minProperties: 1,
  properties: camposItemFicha,
};
