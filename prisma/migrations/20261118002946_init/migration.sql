-- CreateTable
model Aluno {
  id              Int      @id @default(autoincrement())
  nome            String
  email           String   @unique
  telefone        String?
  dataNascimento  DateTime? @map("data_nascimento")
  criadoEm        DateTime  @default(now()) @map("criado_em")

  contratacoes    Contratacao[]
  fichas          FichaTreino[]
}

-- CreateTable
CREATE TABLE "Instrutor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Instrutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plano" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "valor" DECIMAL(10,2) NOT NULL,
    "duracaoDias" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Plano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contratacao" (
    "id" SERIAL NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "planoId" INTEGER NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVA',

    CONSTRAINT "Contratacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercicio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "grupoMuscular" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Exercicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FichaTreino" (
    "id" SERIAL NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "instrutorId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,

    CONSTRAINT "FichaTreino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemFicha" (
    "id" SERIAL NOT NULL,
    "fichaTreinoId" INTEGER NOT NULL,
    "exercicioId" INTEGER NOT NULL,
    "series" INTEGER NOT NULL,
    "repeticoes" INTEGER NOT NULL,
    "cargaRecomendada" DECIMAL(6,2),
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "ItemFicha_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_email_key" ON "Aluno"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Instrutor_email_key" ON "Instrutor"("email");

-- CreateIndex
CREATE INDEX "Contratacao_alunoId_idx" ON "Contratacao"("alunoId");

-- CreateIndex
CREATE INDEX "Contratacao_planoId_idx" ON "Contratacao"("planoId");

-- CreateIndex
CREATE INDEX "FichaTreino_alunoId_idx" ON "FichaTreino"("alunoId");

-- CreateIndex
CREATE INDEX "FichaTreino_instrutorId_idx" ON "FichaTreino"("instrutorId");

-- CreateIndex
CREATE INDEX "ItemFicha_fichaTreinoId_idx" ON "ItemFicha"("fichaTreinoId");

-- CreateIndex
CREATE INDEX "ItemFicha_exercicioId_idx" ON "ItemFicha"("exercicioId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemFicha_fichaTreinoId_exercicioId_key" ON "ItemFicha"("fichaTreinoId", "exercicioId");

-- AddForeignKey
ALTER TABLE "Contratacao" ADD CONSTRAINT "Contratacao_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contratacao" ADD CONSTRAINT "Contratacao_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "Plano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaTreino" ADD CONSTRAINT "FichaTreino_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaTreino" ADD CONSTRAINT "FichaTreino_instrutorId_fkey" FOREIGN KEY ("instrutorId") REFERENCES "Instrutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemFicha" ADD CONSTRAINT "ItemFicha_fichaTreinoId_fkey" FOREIGN KEY ("fichaTreinoId") REFERENCES "FichaTreino"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemFicha" ADD CONSTRAINT "ItemFicha_exercicioId_fkey" FOREIGN KEY ("exercicioId") REFERENCES "Exercicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
