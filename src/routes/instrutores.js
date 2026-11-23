import { prisma } from "../lib/prisma.js";
import { idSchema, instrutorCompleto, instrutorParcial } from "../lib/schemas.js";

export default async function instrutoresRoutes(app) {
  // Listar todos os instrutores
  app.get("/instrutores", async () => {
    return await prisma.instrutor.findMany({
      orderBy: { id: "asc" },
    });
  });

  // Buscar instrutor por ID
  app.get(
    "/instrutores/:id",
    {
      schema: {
        params: idSchema,
      },
    },
    async (request, reply) => {
      const instrutor = await prisma.instrutor.findUnique({
        where: { id: Number(request.params.id) },
      });

      if (!instrutor) {
        return reply.code(404).send({
          erro: "Instrutor não encontrado",
        });
      }

      return instrutor;
    },
  );

  // Cadastrar instrutor
  app.post(
    "/instrutores",
    {
      schema: {
        body: instrutorCompleto,
      },
    },
    async (request, reply) => {
      try {
        const instrutor = await prisma.instrutor.create({
          data: request.body,
        });

        return reply.code(201).send(instrutor);
      } catch (erro) {
        if (erro.code === "P2002") {
          return reply.code(409).send({
            erro: "Este e-mail já está cadastrado para outro instrutor",
          });
        }

        throw erro;
      }
    },
  );

  // Substituir os dados editáveis do instrutor
  app.put(
    "/instrutores/:id",
    {
      schema: {
        params: idSchema,
        body: instrutorCompleto,
      },
    },
    async (request, reply) => {
      const id = Number(request.params.id);

      try {
        const instrutor = await prisma.instrutor.update({
          where: { id },
          data: {
            ...request.body,
            telefone: request.body.telefone ?? null,
          },
        });

        return instrutor;
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({
            erro: "Instrutor não encontrado",
          });
        }

        if (erro.code === "P2002") {
          return reply.code(409).send({
            erro: "Este e-mail já está cadastrado para outro instrutor",
          });
        }

        throw erro;
      }
    },
  );

  // Atualizar instrutor parcialmente
  app.patch(
    "/instrutores/:id",
    {
      schema: {
        params: idSchema,
        body: instrutorParcial,
      },
    },
    async (request, reply) => {
      const id = Number(request.params.id);

      try {
        const instrutor = await prisma.instrutor.update({
          where: { id },
          data: request.body,
        });

        return instrutor;
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({
            erro: "Instrutor não encontrado",
          });
        }

        if (erro.code === "P2002") {
          return reply.code(409).send({
            erro: "Este e-mail já está cadastrado para outro instrutor",
          });
        }

        throw erro;
      }
    },
  );

  // Excluir instrutor
  app.delete(
    "/instrutores/:id",
    {
      schema: {
        params: idSchema,
      },
    },
    async (request, reply) => {
      const id = Number(request.params.id);

      try {
        await prisma.instrutor.delete({
          where: { id },
        });

        return reply.code(204).send();
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({
            erro: "Instrutor não encontrado",
          });
        }

        if (erro.code === "P2003") {
          return reply.code(409).send({
            erro: "Não é possível excluir o instrutor porque há fichas de treino vinculadas",
          });
        }

        throw erro;
      }
    },
  );
}
