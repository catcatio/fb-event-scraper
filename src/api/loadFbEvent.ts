import * as puppeteer from 'puppeteer'
import * as md5 from 'md5'
import * as LRU from 'lru-cache'

const cache = new LRU({
  max: 100,
  maxAge: 1000 * 60 * 60 // 1 hour
})

const urlKey = (url) => md5(url)

const loadPage = async (url) => {
  const startTime = Date.now()
  let browser
  try {
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_BIN || undefined,
      args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage'],
    })
    const page = await browser.newPage()
    await page.goto(url)
    // wait for div#reaction_units
    const detailSectionSelector = '#reaction_units'
    // this line may cause timeout exception
    await page.waitForSelector(detailSectionSelector)
    const content = await page.content()
    return content
  } catch (error) {
    console.log(`puppeteer ${error}`)
    return ''
  } finally {
    browser && browser.close().then(() => console.log(`puppeteer closed`))
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