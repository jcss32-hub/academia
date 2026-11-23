import { prisma } from "../lib/prisma.js";
import { idSchema, planoCompleto, planoParcial } from "../lib/schemas.js";

export default async function planosRoutes(app) {
  // Listar todos os planos
  app.get("/planos", async () => {
    return await prisma.plano.findMany({
      orderBy: { id: "asc" },
    });
  });

  // Buscar plano por ID
  app.get(
    "/planos/:id",
    {
      schema: {
        params: idSchema,
      },
    },
    async (request, reply) => {
      const plano = await prisma.plano.findUnique({
        where: { id: Number(request.params.id) },
      });

      if (!plano) {
        return reply.code(404).send({
          erro: "Plano não encontrado",
        });
      }

      return plano;
    },
  );

  // Cadastrar plano
  app.post(
    "/planos",
    {
      schema: {
        body: planoCompleto,
      },
    },
    async (request, reply) => {
      const plano = await prisma.plano.create({
        data: request.body,
      });

      return reply.code(201).send(plano);
    },
  );

  // Substituir os dados editáveis do plano
  app.put(
    "/planos/:id",
    {
      schema: {
        params: idSchema,
        body: planoCompleto,
      },
    },
    async (request, reply) => {
      const id = Number(request.params.id);

      try {
        const plano = await prisma.plano.update({
          where: { id },
          data: {
            ...request.body,
            descricao: request.body.descricao ?? null,
            ativo: request.body.ativo ?? true,
          },
        });

        return plano;
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({
            erro: "Plano não encontrado",
          });
        }

        throw erro;
      }
    },
  );

  // Atualizar plano parcialmente
  app.patch(
    "/planos/:id",
    {
      schema: {
        params: idSchema,
        body: planoParcial,
      },
    },
    async (request, reply) => {
      const id = Number(request.params.id);

      try {
        const plano = await prisma.plano.update({
          where: { id },
          data: request.body,
        });

        return plano;
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({
            erro: "Plano não encontrado",
          });
        }

        throw erro;
      }
    },
  );

  // Excluir plano
  app.delete(
    "/planos/:id",
    {
      schema: {
        params: idSchema,
      },
    },
    async (request, reply) => {
      const id = Number(request.params.id);

      try {
        await prisma.plano.delete({
          where: { id },
        });

        return reply.code(204).send();
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({
            erro: "Plano não encontrado",
          });
        }

        if (erro.code === "P2003") {
          return reply.code(409).send({
            erro: "Não é possível excluir o plano porque há contratações vinculadas",
          });
        }

        throw erro;
      }
    },
  );
}
