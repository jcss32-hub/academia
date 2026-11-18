import { prisma } from "../lib/prisma.js";
import { alunoCompleto, alunoParcial, idSchema } from "../lib/schemas.js";

export default async function alunosRoutes(app) {
  // Listar todos os alunos
  app.get("/alunos", async () => {
    return await prisma.aluno.findMany({
      orderBy: { id: "asc" },
    });
  });

  // Buscar aluno por ID
  app.get(
    "/alunos/:id",
    {
      schema: {
        params: idSchema,
      },
    },
    async (request, reply) => {
      const aluno = await prisma.aluno.findUnique({
        where: { id: Number(request.params.id) },
      });

      if (!aluno) {
        return reply.code(404).send({
          erro: "Aluno não encontrado",
        });
      }

      return aluno;
    },
  );

  // Cadastrar aluno
  app.post(
    "/alunos",
    {
      schema: {
        body: alunoCompleto,
      },
    },
    async (request, reply) => {
      try {
        const aluno = await prisma.aluno.create({
          data: request.body,
        });

        return reply.code(201).send(aluno);
      } catch (erro) {
        if (erro.code === "P2002") {
          return reply.code(409).send({
            erro: "Este e-mail já está cadastrado",
          });
        }

        throw erro;
      }
    },
  );

  // Atualizar aluno
  app.patch(
    "/alunos/:id",
    {
      schema: {
        params: idSchema,
        body: alunoParcial,
      },
    },
    async (request, reply) => {
      const id = Number(request.params.id);

      try {
        const aluno = await prisma.aluno.update({
          where: { id },
          data: request.body,
        });

        return aluno;
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({
            erro: "Aluno não encontrado",
          });
        }

        if (erro.code === "P2002") {
          return reply.code(409).send({
            erro: "Este e-mail já está cadastrado",
          });
        }

        throw erro;
      }
    },
  );
}
