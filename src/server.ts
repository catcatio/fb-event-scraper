import scraper from './api/scraper'
import fbEventLoader from './api/loadFbEvent'
import initExpress from './initExpress'

export default {
  start: async (config) => {
    const scrap = scraper(`http://localhost:${config.port}/loadFbEvent?fbEventUrl=`)
    const loadFbEvent = fbEventLoader()

    const app = await initExpress(config)

    app.use('/scrap', (req, res) => {
      const url = req.query.url
      scrap(url).then((json) => res.json(json))
    })

    app.use('/loadFbEvent', (req, res) => {
      const fbEventUrl = req.query.fbEventUrl
      console.log(fbEventUrl)
      if (fbEventUrl) {
        loadFbEvent(fbEventUrl).then((html) => {
          res.send(html)
        })
      }
      else {
        res.sendStatus(400)
      }
    })
  }
}