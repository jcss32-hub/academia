
import Fastify from 'fastify'
import alunosRoutes from './routes/alunos.js'
import instrutoresRoutes from './routes/instrutores.js'
import planosRoutes from './routes/planos.js'
import contratacoesRoutes from './routes/contratacoes.js'
import exerciciosRoutes from './routes/exercicios.js'
import fichasTreinoRoutes from './routes/fichas-treino.js'

const app = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      removeAdditional: false
    }
  }
})

app.get('/ping', async () => {
  return { mensagem: 'pong' }
})

const start = async () => {
  try {
    await app.register(alunosRoutes)
    await app.register(instrutoresRoutes)
    await app.register(planosRoutes)
    await app.register(contratacoesRoutes)
    await app.register(exerciciosRoutes)
    await app.register(fichasTreinoRoutes)
    await app.listen({
      port: 3000,
      host: '0.0.0.0'
    })
  } catch (erro) {
    app.log.error(erro)
    process.exit(1)
  }
}

start()
