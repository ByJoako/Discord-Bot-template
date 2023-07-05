const { readdirSync } = require(`fs`)

module.exports = async (client) => {
  const eventsDirs = readdirSync(`./events`)
  for (let eventDir of eventsDirs) {
    const eventsFiles = readdirSync(`./events/${eventDir}`).filter(f => f.endsWith(`.js`))
    for (let file of eventsFiles) {
      const event = require(`../events/${eventDir}/${file}`)
      if (event.once) client.once(event.name, (...args) => event.execute(...args))
      else client.on(event.name, (...args) => event.execute(...args))
    }
  }
}