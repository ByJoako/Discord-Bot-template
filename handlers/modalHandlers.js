const { readdirSync, existsSync } = require('fs');
const path = require('path');

function registerModals(client, addonFolder) {
  if (existsSync(path.join('./addons', addonFolder, 'modals'))) {
    const modalFiles = readdirSync(path.join('./addons', addonFolder, 'modals')).filter((file) => file.endsWith('.js'));
    modalFiles.map((file) => {
      const modal = require(`../addons/${addonFolder}/modals/${file}`);
      client.modals.set(modal.name, modal)
    });
  }
}

module.exports = { registerModals };
