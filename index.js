const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = "!";

client.once("ready", () => {
  console.log("Bot online");
});

client.on("messageCreate", async (message) => {

  if (!message.guild) return;
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const cmd = args.shift().toLowerCase();

  if (cmd === "ban") {

    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return;

    const member = message.mentions.members.first();
    if (!member) return message.reply("Mention a user");

    await member.ban();
    message.channel.send(`${member.user.tag} banned`);
  }

  if (cmd === "unban") {

    const id = args[0];
    if (!id) return;

    await message.guild.members.unban(id);
    message.channel.send("User unbanned");
  }

  if (cmd === "jail") {

    const member = message.mentions.members.first();
    const role = message.guild.roles.cache.find(r => r.name === "Jailed");

    if (!member || !role) return;

    await member.roles.add(role);
    message.channel.send(`${member.user.tag} jailed`);
  }

  if (cmd === "unjail") {

    const member = message.mentions.members.first();
    const role = message.guild.roles.cache.find(r => r.name === "Jailed");

    if (!member || !role) return;

    await member.roles.remove(role);
    message.channel.send(`${member.user.tag} released`);
  }

});

client.login(process.env.TOKEN);
