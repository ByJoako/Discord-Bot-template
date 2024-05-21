require('dotenv').config();
const { Client, Collection } = require('discord.js');
const mongoose = require('mongoose');

const { loadAddons } = require('./utils/loadAddons');
const { botConfig } = require('./utils/config');

// Crear instancia del cliente
const client = new Client(botConfig);

// Configurar propiedades del cliente
setupClientProperties(client);

// Cargar addons
loadAddons(client);

// Iniciar sesión
loginToDiscord(client);

// Manejar rechazos no manejados
handleUnhandledRejections();

// Conectar a MongoDB
connectToMongoDB();

// Funciones

function setupClientProperties(client) {
  client.info = function info(message) {
    console.log(`\u001B[32m[${new Date().toLocaleTimeString()}] ${message}\u001B[0m`);
  };

  client.prefix = process.env.DEFAULT_PREFIX;
  client.commands = new Collection();
  client.slashcommands = new Collection();
  client.buttons = new Collection();
  client.selectMenus = new Collection();
  client.contextCommands = new Collection();
  client.modals = new Collection();
  client.addonEvents = new Collection();
  client.commandData = [];
}

function loginToDiscord(client) {
  client.login(process.env.TOKEN)
    .then(() => client.info(`The ${client.user.tag} bot loaded correctly.`))
    .catch((err) => {
      console.error('Error logging in with the provided token:', err);
      process.exit(1);
    });
}

function handleUnhandledRejections() {
  process.on('unhandledRejection', (error) => {
    console.error('Unhandled error:', error);
  });
}

function connectToMongoDB() {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => client.info('Connected successfully to the database.'))
    .catch((err) => {
      console.error(`Error occurred while connecting to the database.\n${err.stack}`);
      process.exit(1);
    });

  mongoose.connection.on('err', (err) => {
    console.error(`Error occurred while connecting to the database.\n${err.stack}`);
  });

  mongoose.connection.on('disconnected', () => {
    client.info('Lost connection to the database');
  });
}
