const url = 'http://www.facebook.com/events/2264532963783817/'
const puppeteer = require('puppeteer')
const md5 = require('md5')
const LRU = require("lru-cache")
  , options = {
    max: 500,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
  , cache = LRU(options)

const port = process.env.PORT

const urlKey = (url) => md5(url)

const loadPage = async (url) => {
  try {
    const browser = await puppeteer.launch({
      executablePath: process.env.CHROME_BIN || undefined,
      args: ['--no-sandbox', '--headless', '--disable-gpu'],
    })
    const page = await browser.newPage()
    await page.goto(url)
    const detailSectionSelector = '#reaction_units'
    await page.waitForSelector(detailSectionSelector)
    const content = await page.content()
    await browser.close().then(() => console.log(`puppeteer closed`))

    return content
  } catch (error) {
    console.log(`puppeteer ${error}`)
    throw error
  }
}

const startExpress = (port = 3000) => new Promise((resolve) => {
  const app = require('express')()
  const bodyParser = require('body-parser')
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.listen(port, (err) => {
    console.log(err || `listening to ${port}`)
    resolve(app)
  })

  app.use('/scrap', (req, res) => {
    const url = req.query.url
    scrap(url).then((json) => res.json(json))
  })

  app.use('/', (req, res) => {
    const url = req.query.url
    console.log(url)
    if (url) {
      fromCacheOrLoad(url).then((html) => {
        res.send(html)
      })
    }
    else {
      res.sendStatus(400)
    }
  })
})

const fromCacheOrLoad = async (url) => {
  const key = urlKey(url)
  const cachedData = cache.get(key)
  if (cachedData) {
    return cachedData
  }
  const data = await loadPage(url)
  cache.set(key, data)
  return data
}

const scrap = (url) => new Promise((resolve, reject) => {
  const osmosis = require('osmosis')
  let final = {}
  osmosis.get(`http://localhost:${port}/?url=${url}`)
    // .set({ title: 'title' })
    .find('#event_header_primary')
    .set({ title: 'h1' })
    .find('img.scaledImageFitHeight')
    .set({ coverImage: '@src' })
    .find('#event_time_info')
    .set({ eventTime: 'div@content' })
    .find('#event_time_info + li')
    .set({
      venue: 'tr > td:skip(1) > div > div',
      venueLink: '.hidden_elem > div > div:last a[role=button]@href'
    })
    .find('#reaction_units > div > div:first > div > div:last')
    .set({
      description: 'span',
    })
    .data((data) => {
      final = data
    })
    .done(() => {
      console.log(final)
      // resolve(f)
      resolve(final)
      console.log('= = osmosis = =')
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log)
})

const start = async (port) => {
  await startExpress(port)
  // await scrap(url)
}

start(port).then(() => console.log('= = D O N E = ='))
