const { GatewayIntentBits } = require('discord.js')

module.exports = {
  botConfig: {
    allowedMentions: { parse: ['users', 'roles'] },
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.DirectMessages,
    ],
  },
};
