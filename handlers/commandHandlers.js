const { readdirSync, existsSync } = require('fs');
const path = require('path');

function registerCommands(client, addonFolder) {
  if (existsSync(path.join('./addons', addonFolder, 'commands'))) {
    const commandFiles = readdirSync(path.join('./addons', addonFolder, 'commands')).filter((file) => file.endsWith('.js'));
    commandFiles.map((file) => {
      const command = require(`../addons/${addonFolder}/commands/${file}`);
      client.commands.set(command.name, command)
    });
  }
}

module.exports = { registerCommands };
