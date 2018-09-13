export default ({mailgunKey, mailgunDomain, mailgunSender, mailgunRecipient}) => {
  const mailgun = require('mailgun-js')({ apiKey: mailgunKey, domain: mailgunDomain })

  return {
    send: (html) => {
      const mailOption = {
        from: mailgunSender,
        to: mailgunRecipient,
        subject: `[FAILURE] fb scrapper on ${new Date().toISOString()}`,
        html
      }

      console.log(mailOption)
      mailgun.messages().send(mailOption, (error, body) => {
        console.log(error || body)
      })
    }
  }
}