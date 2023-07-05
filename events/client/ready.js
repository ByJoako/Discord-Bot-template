module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    client.info(`The ${client.user.tag} bot loaded correctly.`)
  }
}