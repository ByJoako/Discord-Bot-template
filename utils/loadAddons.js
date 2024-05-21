const { readdirSync } = require('fs');
const { REST, Routes } = require('discord.js')

const { registerButtons } = require('../handlers/buttonHandlers')
const { registerCommands } = require('../handlers/commandHandlers')
const { registerContextMenu } = require('../handlers/contextMenuHandlers')
const { registerEvents, registerClientEvents } = require('../handlers/eventHandlers')
const { registerModals } = require('../handlers/modalHandlers')
const { registerSelectMenu } = require('../handlers/selectMenuHandlers')
const { registerSlashCommands } = require('../handlers/slashCommandHandlers')

function loadAddons(client) {
  client.info('Loading addons...')
  const addonsFolders = readdirSync('./addons', { withFileTypes: true }).filter((folder) => folder.isDirectory());
  
  for (let addonFolder of addonsFolders) {
    registerButtons(client, addonFolder.name);
    registerCommands(client, addonFolder.name);
    registerContextMenu(client, addonFolder.name);
    registerEvents(client, addonFolder.name);
    registerModals(client, addonFolder.name);
    registerSelectMenu(client, addonFolder.name);
    registerSlashCommands(client, addonFolder.name);
    client.info(`${capitalizeFirstLetter(addonFolder.name)} was loaded successfully`)
  }
  
  registerEvent(client)
  registerRoutesCommands(client)
  registerClientEvents(client)
}

function registerEvent(client) {
  for (const [eventName, handlers] of Object.entries(client.addonEvents)) {
    if (handlers.length === 1) {
      client.on(eventName, (...args) => handlers[0](...args));
    } else {
      client.on(eventName, (...args) => {
        for (const handler of handlers) {
          handler(...args);
        }
      });
    }
  }
}

async function registerRoutesCommands(client) {
  const rest = new REST().setToken(process.env.TOKEN);
  try {
	  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: client.commandData })
  } catch (error) {
  	console.error(error)
  	process.exit(1)
  }
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = { loadAddons }