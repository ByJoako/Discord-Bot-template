const { readdirSync, existsSync } = require('fs');
const path = require('path');

function registerButtons(client, addonFolder) {
  if (existsSync(path.join('./addons', addonFolder, 'buttons'))) {
    const buttonFiles = readdirSync(path.join('./addons', addonFolder, 'buttons')).filter((file) => file.endsWith('.js'));
    buttonFiles.map((file) => {
      const button = require(`../addons/${addonFolder}/buttons/${file}`);
      client.buttons.set(button.name, button)
    });
  }
}

module.exports = { registerButtons };
