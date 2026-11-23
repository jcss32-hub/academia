import { prisma } from "../lib/prisma.js";
import { idSchema, itemFichaCompleto, itemFichaParcial } from "../lib/schemas.js";

function erroRelacionamento(reply) {
  return reply.code(409).send({
    erro: "A ficha de treino ou o exercício informado não existe",
  });
}

export default async function itensFichaRoutes(app) {
  // Listar todos os itens de ficha
  app.get("/itens-ficha", async () => {
    return await prisma.itemFicha.findMany({
      orderBy: [{ id_ficha: "asc" }, { ordem: "asc" }],
    });
  });

  // Buscar item de ficha por ID
  app.get(
    "/itens-ficha/:id",
    { schema: { params: idSchema } },
    async (request, reply) => {
      const item = await prisma.itemFicha.findUnique({
        where: { id: Number(request.params.id) },
      });

      if (!item) {
        return reply.code(404).send({ erro: "Item de ficha não encontrado" });
      }

      return item;
    },
  );

  // Cadastrar item de ficha
  app.post(
    "/itens-ficha",
    { schema: { body: itemFichaCompleto } },
    async (request, reply) => {
      try {
        const item = await prisma.itemFicha.create({ data: request.body });
        return reply.code(201).send(item);
      } catch (erro) {
        if (erro.code === "P2003") return erroRelacionamento(reply);
        throw erro;
      }
    },
  );

  // Substituir os dados editáveis do item de ficha
  app.put(
    "/itens-ficha/:id",
    { schema: { params: idSchema, body: itemFichaCompleto } },
    async (request, reply) => {
      try {
        return await prisma.itemFicha.update({
          where: { id: Number(request.params.id) },
          data: {
            ...request.body,
            carga_recomendada: request.body.carga_recomendada ?? null,
          },
        });
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({ erro: "Item de ficha não encontrado" });
        }
        if (erro.code === "P2003") return erroRelacionamento(reply);
        throw erro;
      }
    },
  );

  // Atualizar item de ficha parcialmente
  app.patch(
    "/itens-ficha/:id",
    { schema: { params: idSchema, body: itemFichaParcial } },
    async (request, reply) => {
      try {
        return await prisma.itemFicha.update({
          where: { id: Number(request.params.id) },
          data: request.body,
        });
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({ erro: "Item de ficha não encontrado" });
        }
        if (erro.code === "P2003") return erroRelacionamento(reply);
        throw erro;
      }
    },
  );

  // Excluir item de ficha
  app.delete(
    "/itens-ficha/:id",
    { schema: { params: idSchema } },
    async (request, reply) => {
      try {
        await prisma.itemFicha.delete({
          where: { id: Number(request.params.id) },
        });
        return reply.code(204).send();
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({ erro: "Item de ficha não encontrado" });
        }
        if (erro.code === "P2003") {
          return reply.code(409).send({
            erro: "Não é possível excluir o item de ficha devido a registros relacionados",
          });
        }
        throw erro;
      }
    },
  );
}

