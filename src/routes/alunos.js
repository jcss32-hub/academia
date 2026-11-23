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

  // Substituir os dados editáveis do aluno
  app.put(
    "/alunos/:id",
    {
      schema: {
        params: idSchema,
        body: alunoCompleto,
      },
    },
    async (request, reply) => {
      const id = Number(request.params.id);

      try {
        const aluno = await prisma.aluno.update({
          where: { id },
          data: {
            ...request.body,
            // No PUT, telefone omitido é substituído por null.
            telefone: request.body.telefone ?? null,
          },
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

  // Atualizar aluno parcialmente
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

  // Excluir aluno
  app.delete(
    "/alunos/:id",
    {
      schema: {
        params: idSchema,
      },
    },
    async (request, reply) => {
      const id = Number(request.params.id);

      try {
        await prisma.aluno.delete({
          where: { id },
        });

        return reply.code(204).send();
      } catch (erro) {
        if (erro.code === "P2025") {
          return reply.code(404).send({
            erro: "Aluno não encontrado",
          });
        }

        if (erro.code === "P2003") {
          return reply.code(409).send({
            erro: "Não é possível excluir o aluno porque há registros relacionados",
          });
        }

        throw erro;
      }
    },
  );
}
