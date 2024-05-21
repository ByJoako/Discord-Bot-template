const { readdirSync, existsSync } = require('fs');
const path = require('path');

function registerContextMenu(client, addonFolder) {
  if (existsSync(path.join('./addons', addonFolder, 'contextmenus'))) {
    const contextmenuFiles = readdirSync(path.join('./addons', addonFolder, 'contextmenus')).filter((file) => file.endsWith('.js'));
    contextmenuFiles.map((file) => {
      const contextmenu = require(`../addons/${addonFolder}/contextmenus/${file}`);
      client.contextCommands.set(contextmenu.data.name, contextmenu)
      client.commandData.push(contextmenu.data)
    });
  }
}

module.exports = { registerContextMenu };
