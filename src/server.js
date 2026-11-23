
import Fastify from 'fastify'
import alunosRoutes from './routes/alunos.js'
import instrutoresRoutes from './routes/instrutores.js'

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
