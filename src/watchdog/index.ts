const gitdiff = require('git-diff')
const Convert = require('ansi-to-html')
const request = require('request-promise')
const convert = new Convert();

const defaultDiffOptions = {
  color: true,      // Add color to the git diff returned? default is false
  flags: '--ignore-all-space',       // A space separated string of git diff flags from https://git-scm.com/docs/git-diff#_options
  forceFake: false,  // Do not try and get a real git diff, just get me a fake? Faster but may not be 100% accurate
  noHeaders: false,  // Remove the ugly @@ -1,3 +1,3 @@ header?
  save: false,       // Remember the options for next time?
  wordDiff: false     // Get a word diff instead of a line diff?
}

const compare = (objA, objB) => {
  const objAStr = objToString(objA)
  const objBStr = objToString(objB)
  const diff = gitdiff(objAStr, objBStr, defaultDiffOptions)
  return diff
}

const replaceAll = (target, search, replacement) => {
  return target.replace(new RegExp(search, 'g'), replacement);
}

const objToString = (obj) => JSON.stringify(obj, null, 2)

const toHtml = (text) => {
  const br = replaceAll(convert.toHtml(text), '\n', '<br/>\n')
  const color = replaceAll(br, '#FFF', '#000')
  return color
}

const isURL = (str) => {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(str);
}

const isNotEmpty = (object) => {
  return !!object
}

const isEqual = (expectingValue) => (object) => {
  return object === expectingValue
}

const hasProperty = (obj, propertyName, type, validator: (object) => boolean = null) => {
  const p = obj.hasOwnProperty(propertyName)
    && typeof obj[propertyName] === type
  const v =  !validator || validator(obj[propertyName])
  return p && v
}

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
      console.log('watchdog', 'Start testing fb API')

      const currentResult = await loadEvent(watchdogEventUrl)
      const hasAllProperties = hasProperty(currentResult, 'title', 'string', isEqual(watchdogExpectedResult['title']))
        && hasProperty(currentResult, 'coverImage', 'string', isURL)
        && hasProperty(currentResult, 'eventTime', 'string', isEqual(watchdogExpectedResult['eventTime']))
        && hasProperty(currentResult, 'venue', 'string', isEqual(watchdogExpectedResult['venue']))
        && hasProperty(currentResult, 'venueLink', 'string', isEqual(watchdogExpectedResult['venueLink']))
        && hasProperty(currentResult, 'description', 'string', isEqual(watchdogExpectedResult['description']))

      if (hasAllProperties) {
        console.log('watchdog', 'All OK!!!')
        return
      }

      const diff = compare(watchdogExpectedResult, currentResult)
      if (diff) {
        console.log('watchdog', 'mismatched !!!')
        onErrorFunc(diff, toHtml(diff))
        return
      }
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