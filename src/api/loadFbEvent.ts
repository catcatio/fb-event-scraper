import * as puppeteer from 'puppeteer'
import * as md5 from 'md5'
import * as LRU from 'lru-cache'

const cache = new LRU({
  max: 500,
  maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
})

const urlKey = (url) => md5(url)

const loadPage = async (url) => {
  const startTime = Date.now()
  try {
    const browser = await puppeteer.launch({
      executablePath: process.env.CHROME_BIN || undefined,
      args: ['--no-sandbox', '--headless', '--disable-gpu'],
    })
    const page = await browser.newPage()
    await page.goto(url)
    // wait for div#reaction_units
    const detailSectionSelector = '#reaction_units'
    await page.waitForSelector(detailSectionSelector)
    const content = await page.content()
    await browser.close().then(() => console.log(`puppeteer closed`))

    return content
  } catch (error) {
    console.log(`puppeteer ${error}`)
    return ''
  } finally {
    console.log(`loadPage ${url} took ${Date.now() - startTime} ms.`)
  }
}

const loadCacheFirst = async (url) => {
  const key = urlKey(url)
  const cachedData = cache.get(key)
  if (cachedData) {
    console.log(`hit:  ${url}`)
    return cachedData
  }
  console.log(`miss: ${url}`)
  const data = await loadPage(url)
  if (!data) {
    return ''
  }
  cache.set(key, data)
  return data
}

export default () => (url) => loadCacheFirst(url)