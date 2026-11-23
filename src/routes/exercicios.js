import { prisma } from "../lib/prisma.js";
import { exercicioCompleto, exercicioParcial, idSchema } from "../lib/schemas.js";

export default async function exerciciosRoutes(app) {
  // Listar todos os exercícios
  app.get("/exercicios", async () => {
    return await prisma.exercicio.findMany({
      orderBy: { id: "asc" },
    });
  });

  // Buscar exercício por ID
  app.get(
    "/exercicios/:id",
    { schema: { params: idSchema } },
    async (request, reply) => {
      const exercicio = await prisma.exercicio.findUnique({
        where: { id: Number(request.params.id) },
      });

      if (!exercicio) {
        return reply.code(404).send({ erro: "Exercício não encontrado" });
      }

      return exercicio;
    },
  );

  // Cadastrar exercício
  app.post(
    "/exercicios",
    { schema: { body: exercicioCompleto } },
    async (request, reply) => {
      const exercicio = await prisma.exercicio.create({
        data: request.body,
      });

      return reply.code(201).send(exercicio);
    },
  );

  // Substituir os dados editáveis do exercício
  app.put(
    "/exercicios/:id",
    { schema: { params: idSchema, body: exercicioCompleto } },
    async (request, reply) => {
      try {
        return await prisma.exercicio.update({
          where: { id: Number(request.params.id) },
          data: {
            ...request.body,
            descricao: request.body.descricao ?? null,
            grupo_muscular: request.body.grupo_muscular ?? null,
            ativo: request.body.ativo ?? true,
          },
        });
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({ erro: "Exercício não encontrado" });
        }
        throw erro;
      }
    },
  );

  // Atualizar exercício parcialmente
  app.patch(
    "/exercicios/:id",
    { schema: { params: idSchema, body: exercicioParcial } },
    async (request, reply) => {
      try {
        return await prisma.exercicio.update({
          where: { id: Number(request.params.id) },
          data: request.body,
        });
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({ erro: "Exercício não encontrado" });
        }
        throw erro;
      }
    },
  );

  // Excluir exercício. O banco impede a exclusão se houver itens de ficha.
  app.delete(
    "/exercicios/:id",
    { schema: { params: idSchema } },
    async (request, reply) => {
      try {
        await prisma.exercicio.delete({
          where: { id: Number(request.params.id) },
        });
        return reply.code(204).send();
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({ erro: "Exercício não encontrado" });
        }
        if (erro.code === "P2003") {
          return reply.code(409).send({
            erro: "Não é possível excluir o exercício porque há itens de ficha vinculados",
          });
        }
        throw erro;
      }
    },
  );
}

