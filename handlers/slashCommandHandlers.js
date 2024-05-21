const { readdirSync, existsSync } = require('fs');
const path = require('path');

function registerSlashCommands(client, addonFolder) {
  if (existsSync(path.join('./addons', addonFolder, 'slashcommands'))) {
    const slashcommandFiles = readdirSync(path.join('./addons', addonFolder, 'slashcommands')).filter((file) => file.endsWith('.js'));
    slashcommandFiles.map((file) => {
      const slashcommand = require(`../addons/${addonFolder}/slashcommands/${file}`);
      client.slashcommands.set(slashcommand.data.name, slashcommand)
      client.commandData.push(slashcommand.data)
    });
  }
}

module.exports = { registerSlashCommands };
