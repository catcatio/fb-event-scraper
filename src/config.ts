const port = process.env.PORT
const watchdogEnabled = process.env.WATCHDOG_ENABLE === 'true'
const watchdogInterval = parseInt(process.env.WATCHDOG_INTERVAL) || 86400000
const watchdogEventUrl = process.env.WATCHDOG_EVENT_URL
const watchdogScrapUrl = `http://localhost:${port}/scrap/`
const watchdogExpectedResult = !watchdogEnabled ? {} : require(`../${process.env.WATCHDOG_EXPECTED_FILE}`)
console.log('watchdogInterval', watchdogInterval)

export default {
  port,
  watchdogEnabled,
  watchdogInterval,
  watchdogEventUrl,
  watchdogScrapUrl,
  watchdogExpectedResult,
  mailgunKey: process.env.MAILGUN_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  mailgunSender: process.env.MAILGUN_SENDER,
  mailgunRecipient: process.env.MAILGUN_RECIPIENT
}