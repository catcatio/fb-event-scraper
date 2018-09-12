import * as express from 'express'
import {Express} from 'express'

export default ({port}) => new Promise<Express>((resolve) => {
  const app = express()
  const bodyParser = require('body-parser')
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.listen(port, (err) => {
    console.log(err || `listening to ${port}`)
    resolve(app)
  })

  return app
})