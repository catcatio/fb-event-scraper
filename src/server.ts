import initExpress from './initExpress'
import initApi from './initApi'
import initMailer from './initMailer'

const start = async (config) => {
  const app = await initExpress(config)
  await initApi(app, config)
  const mailer = initMailer(config)

  const wd = require('./watchdog')(config)
  wd.start((diff, html) => {
    console.error('!!! result mismatched !!!')
    console.log(diff)
    mailer.send(html)
  })
}

export default {
  start
}