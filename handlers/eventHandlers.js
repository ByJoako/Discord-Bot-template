const { readdirSync, existsSync } = require('fs');
const path = require('path');
const { InteractionType, EmbedBuilder } = require('discord.js')

function registerEvents(client, addonFolder) {
  if (existsSync(`./addons/${addonFolder}/events`)) {
    const eventsFiles = readdirSync(`./addons/${addonFolder}/events`).filter(f => f.endsWith('.js'));
      
    for (let file of eventsFiles) {
      const event = require(`../addons/${addonFolder}/events/${file}`);
        
      if (!client.addonEvents[event.name]) {
        client.addonEvents[event.name] = [];
      }
      if (event.once) client.once(event.name, (...args) => event.execute(...args))
      else client.addonEvents[event.name].push(event.execute)
    }
  }
};  


function registerClientEvents(client) {
  client.on('interactionCreate', (interaction) => {
    if (interaction.isButton()) {
      handleButtonInteraction(interaction, client);
    } else if (interaction.isContextMenuCommand()) {
      handleContextMenuInteraction(interaction, client);
    } else if (interaction.isModalSubmit()) {
      handleModalInteraction(interaction, client);
    } else if (interaction.isStringSelectMenu()) {
      handleSelectMenuInteraction(interaction, client);
    } else if (interaction.isCommand()) {
      handleCommandInteraction(interaction);
    } else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
      handleAutoComplete(interaction, client)
    }
  });
  
  client.on('messageCreate', (message) => {
    const { author, guild, content } = message;
    const { prefix, commands } = client;
  
    if (author.bot || !guild) return;
  
    if (!content.startsWith(prefix) && !content.startsWith(`<@${client.user.id}>`)) return;
  
    const args = content.slice(content.startsWith(prefix) ? prefix.length : (`<@!${client.user.id}>`).length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
  
    const command = commands.get(cmd);
    if (!command) return;
  
  
    command.execute(message, args);
  });
}

function handleButtonInteraction(interaction, client) {
  const button = client.buttons.get(interaction.customId);
  if (!button) return;

  button.execute(interaction);
}

function handleContextMenuInteraction(interaction) {
  const context = client.contextCommands.get(interaction.commandName);
  if (!context) return;

  context.execute(interaction);
}

function handleModalInteraction(interaction, client) {
  const modal = client.modals.get(interaction.customId)
  if (!modal) return
   
  modal.execute(interaction)
}

function handleSelectMenuInteraction(interaction, client) {
  const select = client.selectMenus.get(interaction.customId);
  if (!select) return;

  select.execute(interaction);
}

function handleCommandInteraction(interaction) {
  const { client, commandName, user, guild, channel, options } = interaction
  const command = client.slashcommands.get(commandName);
  if (!command) return;
  
  sendEmbed(client, user, guild, channel,  `/${command.data.name} ${options._subcommand ? options.getSubcommand() : ""}`)
  command.execute(interaction);
}

function handleAutoComplete(interaction, client) {
  const command = client.slashcommands.get(interaction.commandName);
  if (!command) return;
  if (!command.autocomplete) return console.log(interaction.commandName)
  command.autocomplete(interaction);
}

module.exports = { registerEvents, registerClientEvents };

async function sendEmbed(client, user, guild, channel, command) {
  const channelLog = client.channels.cache.get(process.env.LOGS)
  
  if(!channelLog) return
  
  channelLog.send({ embeds: [new EmbedBuilder()
    .setAuthor({
      name: `Command used!`,
      iconURL: user.displayAvatarURL({ dynamic: true}),
    })
    .addFields([{
      name: "User",
      value: `\`\`\`${user.tag} | ${user.id}\`\`\``,
      inline: true
    },{
      name: "Guild",
      value: `\`\`\`${guild.name}\`\`\``,
      inline: true
    },{
      name: "Guild ID",
      value: `\`\`\`${guild.id}\`\`\``,
      inline: true
    },{
      name: "Command used:",
      value: `\`\`\`${command}\`\`\``,
    },{
      name: "Used in:",
      value: `\`\`\`${channel.name}\`\`\``,
    }])
  .setColor("#00A56A")
  .setFooter({
    text: `Guild: ${guild.name}`
  })
  .setTimestamp()] })
}