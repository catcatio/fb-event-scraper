const gitdiff = require('git-diff')
const Convert = require('ansi-to-html')
const request = require('request-promise')

const replaceAll = (target, search, replacement) => {
  return target.replace(new RegExp(search, 'g'), replacement);
}
const convert = new Convert();
const objToString = (obj) => JSON.stringify(obj, null, 2)

const defaultDiffOptions = {
  color: true,      // Add color to the git diff returned? default is false
  flags: '--diff-algorithm=minimal --ignore-all-space',       // A space separated string of git diff flags from https://git-scm.com/docs/git-diff#_options
  forceFake: false,  // Do not try and get a real git diff, just get me a fake? Faster but may not be 100% accurate
  noHeaders: false,  // Remove the ugly @@ -1,3 +1,3 @@ header?
  save: false,       // Remember the options for next time?
  wordDiff: false    // Get a word diff instead of a line diff?
}

const compare = (objA, objB) => {
  const objAStr = objToString(objA)
  const objBStr = objToString(objB)
  const diff = gitdiff(objAStr, objBStr, defaultDiffOptions)
  return diff
}

const toHtml = (text) => {
  const br = replaceAll(convert.toHtml(text), '\n', '<br />\n')
  return replaceAll(br, '#FFF', '#000')
}

// scrapUrl: http://localhost:9085/scrap/
module.exports = ({ watchdogEnabled, watchdogInterval, watchdogEventUrl, watchdogScrapUrl, watchdogExpectedResult }) => {
  let instance
  const loadEvent = (url) => request({
    uri: watchdogScrapUrl,
    qs: {
      url: `${url}?${Date.now()}`
    },
    json: true // Automatically parses the JSON string in the response})
  })

  const start = (onErrorFunc: (diff, html) => void) => {
    if (!watchdogEnabled) {
      return
    }

    instance = setInterval(async () => {
      console.log('Start testing fb API')

      const currentResult = await loadEvent(watchdogEventUrl)
      const diff = compare(watchdogExpectedResult, currentResult)
      if (diff) {
        onErrorFunc(diff, toHtml(diff))
        return
      }
      console.log('All OK!!!')
    }, watchdogInterval)
  }

  const stop = () => {
    if (instance) {
      clearInterval(instance)
      instance = null
    }
  }

  return {
    start,
    stop
  }
}