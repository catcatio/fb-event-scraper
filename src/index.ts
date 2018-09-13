require('dotenv/config')
require('@rabbotio/noconsole')

import config from './config'
import server from './server'

server.start(config)
  .catch(err => {
    console.error(err)
    console.error(err.stack)
  })