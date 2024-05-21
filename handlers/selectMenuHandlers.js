const { readdirSync, existsSync } = require('fs');
const path = require('path');

function registerSelectMenu(client, addonFolder) {
  if (existsSync(path.join('./addons', addonFolder, 'selectmenus'))) {
    const selectmenuFiles = readdirSync(path.join('./addons', addonFolder, 'selectmenus')).filter((file) => file.endsWith('.js'));
    selectmenuFiles.map((file) => {
      const selectmenu = require(`../addons/${addonFolder}/selectmenus/${file}`);
      client.selectmenus.set(selectmenu.name, selectmenu)
    });
  }
}

module.exports = { registerSelectMenu };
