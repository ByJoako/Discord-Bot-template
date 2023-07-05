const { readdirSync } = require(`fs`)
const { REST, Routes } = require(`discord.js`)

module.exports = async (client) => {
  const commandData = []
  const commandsDirs = readdirSync(`./slashcommands`)
  for (let commandDir of commandsDirs) {
    const commandsFiles = readdirSync(`./slashcommands/${commandDir}`).filter(f => f.endsWith(`.js`))
    for (let file of commandsFiles) {
      const command = require(`../slashcommands/${commandDir}/${file}`)
      client.slashCommands.set(command.data.name, command)
      commandData.push(command.data.toJSON())
    }
  }
  
  const rest = new REST().setToken(client.config.token);
  try {
	  await rest.put(Routes.applicationCommands(client.config.clientId), { body: commandData })
  } catch (error) {
  	client.error(error)
  }
}