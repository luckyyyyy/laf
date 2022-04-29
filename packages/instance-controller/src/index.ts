

import * as express from 'express'
import Config from './config'
import { logger } from './support/logger'
import { DatabaseAgent } from './support/db'

DatabaseAgent.init(Config.SYS_DB_URI)

const app = express()

app.get('/healthz', (_req, res) => {
  if (!DatabaseAgent.db) {
    return res.status(400).send('no db connection')
  }
  return res.status(200).send('ok')
})

const server = app.listen(Config.PORT, () => logger.info(`listened on ${Config.PORT}`))

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Caught unhandledRejection:`, reason, promise)
})

process.on('uncaughtException', err => {
  logger.error(`Caught uncaughtException:`, err)
})


process.on('SIGTERM', gracefullyExit)
process.on('SIGINT', gracefullyExit)

async function gracefullyExit() {
  logger.info('exiting: closing db connection')
  await DatabaseAgent.conn.close()
  logger.info('exiting: db connection has been closed')

  server.close(async () => {
    logger.info('process gracefully exited!')
    process.exit(0)
  })
}