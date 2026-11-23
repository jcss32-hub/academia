import { prisma } from "../lib/prisma.js";
import { fichaTreinoCompleta, fichaTreinoParcial, idSchema } from "../lib/schemas.js";

export default async function fichasTreinoRoutes(app) {
  // Listar todas as fichas de treino
  app.get("/fichas-treino", async () => {
    return await prisma.fichaTreino.findMany({
      orderBy: { id: "asc" },
    });
  });

  // Buscar ficha de treino por ID
  app.get(
    "/fichas-treino/:id",
    { schema: { params: idSchema } },
    async (request, reply) => {
      const ficha = await prisma.fichaTreino.findUnique({
        where: { id: Number(request.params.id) },
      });

      if (!ficha) {
        return reply.code(404).send({ erro: "Ficha de treino não encontrada" });
      }

      return ficha;
    },
  );

  // Cadastrar ficha de treino
  app.post(
    "/fichas-treino",
    { schema: { body: fichaTreinoCompleta } },
    async (request, reply) => {
      try {
        const ficha = await prisma.fichaTreino.create({ data: request.body });
        return reply.code(201).send(ficha);
      } catch (erro) {
        if (erro.code === "P2003") {
          return reply.code(409).send({
            erro: "Aluno ou instrutor informado não existe",
          });
        }
        throw erro;
      }
    },
  );

  // Substituir os dados editáveis da ficha
  app.put(
    "/fichas-treino/:id",
    { schema: { params: idSchema, body: fichaTreinoCompleta } },
    async (request, reply) => {
      try {
        return await prisma.fichaTreino.update({
          where: { id: Number(request.params.id) },
          data: {
            ...request.body,
            observacoes: request.body.observacoes ?? null,
          },
        });
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({ erro: "Ficha de treino não encontrada" });
        }
        if (erro.code === "P2003") {
          return reply.code(409).send({
            erro: "Aluno ou instrutor informado não existe",
          });
        }
        throw erro;
      }
    },
  );

  // Atualizar ficha de treino parcialmente
  app.patch(
    "/fichas-treino/:id",
    { schema: { params: idSchema, body: fichaTreinoParcial } },
    async (request, reply) => {
      try {
        return await prisma.fichaTreino.update({
          where: { id: Number(request.params.id) },
          data: request.body,
        });
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({ erro: "Ficha de treino não encontrada" });
        }
        if (erro.code === "P2003") {
          return reply.code(409).send({
            erro: "Aluno ou instrutor informado não existe",
          });
        }
        throw erro;
      }
    },
  );

  // Excluir ficha. O banco impede a exclusão quando há itens vinculados.
  app.delete(
    "/fichas-treino/:id",
    { schema: { params: idSchema } },
    async (request, reply) => {
      try {
        await prisma.fichaTreino.delete({
          where: { id: Number(request.params.id) },
        });
        return reply.code(204).send();
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({ erro: "Ficha de treino não encontrada" });
        }
        if (erro.code === "P2003") {
          return reply.code(409).send({
            erro: "Não é possível excluir a ficha porque há itens vinculados",
          });
        }
        throw erro;
      }
    },
  );
}

