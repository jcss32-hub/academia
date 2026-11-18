/*
  Warnings:

  - You are about to drop the column `criadoEm` on the `Aluno` table. All the data in the column will be lost.
  - You are about to drop the column `dataNascimento` on the `Aluno` table. All the data in the column will be lost.
  - You are about to drop the column `alunoId` on the `Contratacao` table. All the data in the column will be lost.
  - You are about to drop the column `dataFim` on the `Contratacao` table. All the data in the column will be lost.
  - You are about to drop the column `dataInicio` on the `Contratacao` table. All the data in the column will be lost.
  - You are about to drop the column `planoId` on the `Contratacao` table. All the data in the column will be lost.
  - You are about to drop the column `grupoMuscular` on the `Exercicio` table. All the data in the column will be lost.
  - You are about to drop the column `alunoId` on the `FichaTreino` table. All the data in the column will be lost.
  - You are about to drop the column `dataCriacao` on the `FichaTreino` table. All the data in the column will be lost.
  - You are about to drop the column `instrutorId` on the `FichaTreino` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `Instrutor` table. All the data in the column will be lost.
  - You are about to drop the column `cargaRecomendada` on the `ItemFicha` table. All the data in the column will be lost.
  - You are about to drop the column `exercicioId` on the `ItemFicha` table. All the data in the column will be lost.
  - You are about to drop the column `fichaTreinoId` on the `ItemFicha` table. All the data in the column will be lost.
  - You are about to drop the column `duracaoDias` on the `Plano` table. All the data in the column will be lost.
  - Added the required column `data_fim` to the `Contratacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_inicio` to the `Contratacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_aluno` to the `Contratacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_plano` to the `Contratacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_aluno` to the `FichaTreino` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_instrutor` to the `FichaTreino` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_exercicio` to the `ItemFicha` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_ficha` to the `ItemFicha` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duracao_dias` to the `Plano` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contratacao" DROP CONSTRAINT "Contratacao_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "Contratacao" DROP CONSTRAINT "Contratacao_planoId_fkey";

-- DropForeignKey
ALTER TABLE "FichaTreino" DROP CONSTRAINT "FichaTreino_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "FichaTreino" DROP CONSTRAINT "FichaTreino_instrutorId_fkey";

-- DropForeignKey
ALTER TABLE "ItemFicha" DROP CONSTRAINT "ItemFicha_exercicioId_fkey";

-- DropForeignKey
ALTER TABLE "ItemFicha" DROP CONSTRAINT "ItemFicha_fichaTreinoId_fkey";

-- DropIndex
DROP INDEX "Contratacao_alunoId_idx";

-- DropIndex
DROP INDEX "Contratacao_planoId_idx";

-- DropIndex
DROP INDEX "FichaTreino_alunoId_idx";

-- DropIndex
DROP INDEX "FichaTreino_instrutorId_idx";

-- DropIndex
DROP INDEX "ItemFicha_exercicioId_idx";

-- DropIndex
DROP INDEX "ItemFicha_fichaTreinoId_exercicioId_key";

-- DropIndex
DROP INDEX "ItemFicha_fichaTreinoId_idx";

-- AlterTable
ALTER TABLE "Aluno" DROP COLUMN "criadoEm",
DROP COLUMN "dataNascimento",
ADD COLUMN     "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data_nascimento" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Contratacao" DROP COLUMN "alunoId",
DROP COLUMN "dataFim",
DROP COLUMN "dataInicio",
DROP COLUMN "planoId",
ADD COLUMN     "data_fim" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "data_inicio" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id_aluno" INTEGER NOT NULL,
ADD COLUMN     "id_plano" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Exercicio" DROP COLUMN "grupoMuscular",
ADD COLUMN     "grupo_muscular" TEXT;

-- AlterTable
ALTER TABLE "FichaTreino" DROP COLUMN "alunoId",
DROP COLUMN "dataCriacao",
DROP COLUMN "instrutorId",
ADD COLUMN     "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id_aluno" INTEGER NOT NULL,
ADD COLUMN     "id_instrutor" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Instrutor" DROP COLUMN "criadoEm",
ADD COLUMN     "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ItemFicha" DROP COLUMN "cargaRecomendada",
DROP COLUMN "exercicioId",
DROP COLUMN "fichaTreinoId",
ADD COLUMN     "carga_recomendada" DECIMAL(6,2),
ADD COLUMN     "id_exercicio" INTEGER NOT NULL,
ADD COLUMN     "id_ficha" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Plano" DROP COLUMN "duracaoDias",
ADD COLUMN     "duracao_dias" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Contratacao" ADD CONSTRAINT "Contratacao_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contratacao" ADD CONSTRAINT "Contratacao_id_plano_fkey" FOREIGN KEY ("id_plano") REFERENCES "Plano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaTreino" ADD CONSTRAINT "FichaTreino_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaTreino" ADD CONSTRAINT "FichaTreino_id_instrutor_fkey" FOREIGN KEY ("id_instrutor") REFERENCES "Instrutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemFicha" ADD CONSTRAINT "ItemFicha_id_ficha_fkey" FOREIGN KEY ("id_ficha") REFERENCES "FichaTreino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemFicha" ADD CONSTRAINT "ItemFicha_id_exercicio_fkey" FOREIGN KEY ("id_exercicio") REFERENCES "Exercicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
