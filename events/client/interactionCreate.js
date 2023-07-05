module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return
    
    const { client, commandName } = interaction
    const command = client.slashCommands.get(commandName)
    if (!command) return
    
    command.execute(interaction)
  }
}