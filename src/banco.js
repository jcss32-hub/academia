
import { prisma } from './lib/prisma.js'

async function main() {
  const alunos = await prisma.aluno.findMany()

  console.log('Conexão com o banco realizada!')
  console.log('Alunos cadastrados:', alunos)
}

main()
  .catch((erro) => {
    console.error('Erro ao conectar:', erro)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
