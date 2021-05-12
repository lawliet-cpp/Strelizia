const Discord = require("discord.js");
const Levels = require("discord-xp");
module.exports.run = async (bot, message, args) => {
  const target = message.mentions.users.first() || message.author;
  const user = await Levels.fetch(target.id, message.guild.id);
  await message.channel.send(`**${target.tag}** has **${user.xp}** points`);
};

module.exports.config = {
  name: "points",
  aliases: ["points"],
};
