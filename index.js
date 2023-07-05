const { Client, Collection, GatewayIntentBits } = require(`discord.js`);
const { readdirSync } = require(`fs`);
const config = require(`./config.json`)
const client = new Client({ 
  allowedMentions: { parse: ["users", "roles"] },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ]
});

client.config = config
client.slashCommands = new Collection();

const handlerFiles = readdirSync(`./handlers`).filter(file => file.endsWith(`.js`))
for (const file of handlerFiles) {
	require(`./handlers/${file}`)(client);
}

client.login(config.token)
 
client.info = async function info(message) {
  console.log(`\u001B[32m[${new Date().toLocaleTimeString()}] ${message}\u001B[0m`);
 }
 
client.error = async function error(message) {
  console.log(`\u001B[31m[${new Date().toLocaleTimeString()}] ${message}\u001B[0m`);
 }
 
process.on('unhandledRejection', (reason, promise) => client.error(`Unhandled Rejection at: ${promise} \nReason: ${reason}`));

process.on('uncaughtException', (error, origin) => client.error(`Caught exception: ${error}\n Exception origin: ${origin}`,));