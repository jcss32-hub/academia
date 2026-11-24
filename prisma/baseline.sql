-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Aluno" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "data_nascimento" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instrutor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Instrutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plano" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "valor" DECIMAL(10,2) NOT NULL,
    "duracao_dias" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Plano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contratacao" (
    "id" SERIAL NOT NULL,
    "id_aluno" INTEGER NOT NULL,
    "id_plano" INTEGER NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVA',

    CONSTRAINT "Contratacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercicio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "grupo_muscular" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Exercicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FichaTreino" (
    "id" SERIAL NOT NULL,
    "id_aluno" INTEGER NOT NULL,
    "id_instrutor" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,

    CONSTRAINT "FichaTreino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemFicha" (
    "id" SERIAL NOT NULL,
    "id_ficha" INTEGER NOT NULL,
    "id_exercicio" INTEGER NOT NULL,
    "series" INTEGER NOT NULL,
    "repeticoes" INTEGER NOT NULL,
    "carga_recomendada" DECIMAL(6,2),
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "ItemFicha_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_email_key" ON "Aluno"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Instrutor_email_key" ON "Instrutor"("email");

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

