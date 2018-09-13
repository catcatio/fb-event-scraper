const osmosis = require('osmosis')

export default (fbEventUrl) => {
  const scrap = (url) => new Promise((resolve) => {
    let final = {}
    let startTime
    osmosis.get(`${fbEventUrl}${url}`)
      .then(() => {
        startTime = Date.now()
      })
      .find('#event_header_primary')
      .set({ title: 'h1' })
      .find('img.scaledImageFitWidth, img.scaledImageFitHeight')
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
        resolve(final)
        console.log(`osmosis ${url} took ${Date.now() - startTime} ms.`)
      })
      .log(console.log)
      .error(console.error)
      .debug(console.debug)
  })

  return scrap
}