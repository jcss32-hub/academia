import { prisma } from "../lib/prisma.js";
import {
  contratacaoCompleta,
  contratacaoParcial,
  idSchema,
} from "../lib/schemas.js";

function intervaloValido(dataInicio, dataFim) {
  return new Date(dataFim) >= new Date(dataInicio);
}

function erroIntegridade(reply) {
  return reply.code(409).send({
    erro: "Aluno ou plano informado não existe",
  });
}

export default async function contratacoesRoutes(app) {
  // Listar todas as contratações
  app.get("/contratacoes", async () => {
    return await prisma.contratacao.findMany({
      orderBy: { id: "asc" },
    });
  });

  // Buscar contratação por ID
  app.get(
    "/contratacoes/:id",
    { schema: { params: idSchema } },
    async (request, reply) => {
      const contratacao = await prisma.contratacao.findUnique({
        where: { id: Number(request.params.id) },
      });

      if (!contratacao) {
        return reply.code(404).send({ erro: "Contratação não encontrada" });
      }

      return contratacao;
    },
  );

  // Criar contratação
  app.post(
    "/contratacoes",
    { schema: { body: contratacaoCompleta } },
    async (request, reply) => {
      const { data_inicio, data_fim } = request.body;
      if (!intervaloValido(data_inicio, data_fim)) {
        return reply.code(400).send({
          erro: "A data_fim deve ser igual ou posterior à data_inicio",
        });
      }

      try {
        const contratacao = await prisma.contratacao.create({
          data: {
            ...request.body,
            data_inicio: new Date(request.body.data_inicio),
            data_fim: new Date(request.body.data_fim),
          },
        });
        return reply.code(201).send(contratacao);
      } catch (erro) {
        if (erro.code === "P2003") return erroIntegridade(reply);
        throw erro;
      }
    },
  );

  // Substituir os dados editáveis da contratação
  app.put(
    "/contratacoes/:id",
    { schema: { params: idSchema, body: contratacaoCompleta } },
    async (request, reply) => {
      if (!intervaloValido(request.body.data_inicio, request.body.data_fim)) {
        return reply.code(400).send({
          erro: "A data_fim deve ser igual ou posterior à data_inicio",
        });
      }

      try {
        return await prisma.contratacao.update({
          where: { id: Number(request.params.id) },
          data: {
            ...request.body,
            data_inicio: new Date(request.body.data_inicio),
            data_fim: new Date(request.body.data_fim),
            status: request.body.status ?? "ATIVA",
          },
        });
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({ erro: "Contratação não encontrada" });
        }
        if (erro.code === "P2003") return erroIntegridade(reply);
        throw erro;
      }
    },
  );

  // Atualizar parcialmente a contratação
  app.patch(
    "/contratacoes/:id",
    { schema: { params: idSchema, body: contratacaoParcial } },
    async (request, reply) => {
      const id = Number(request.params.id);

      try {
        const atual = await prisma.contratacao.findUnique({ where: { id } });
        if (!atual) {
          return reply.code(404).send({ erro: "Contratação não encontrada" });
        }

        const dataInicio = request.body.data_inicio ?? atual.data_inicio;
        const dataFim = request.body.data_fim ?? atual.data_fim;
        if (!intervaloValido(dataInicio, dataFim)) {
          return reply.code(400).send({
            erro: "A data_fim deve ser igual ou posterior à data_inicio",
          });
        }

        return await prisma.contratacao.update({
          where: { id },
          data: {
            ...request.body,
            ...(request.body.data_inicio && {
              data_inicio: new Date(request.body.data_inicio),
            }),
            ...(request.body.data_fim && {
              data_fim: new Date(request.body.data_fim),
            }),
          },
        });
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({ erro: "Contratação não encontrada" });
        }
        if (erro.code === "P2003") return erroIntegridade(reply);
        throw erro;
      }
    },
  );

  // Excluir contratação
  app.delete(
    "/contratacoes/:id",
    { schema: { params: idSchema } },
    async (request, reply) => {
      try {
        await prisma.contratacao.delete({
          where: { id: Number(request.params.id) },
        });
        return reply.code(204).send();
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({ erro: "Contratação não encontrada" });
        }
        if (erro.code === "P2003") {
          return reply.code(409).send({
            erro: "Não é possível excluir a contratação porque há registros relacionados",
          });
        }
        throw erro;
      }
    },
  );
}

