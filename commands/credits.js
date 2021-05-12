const { Points } = require("../models");

module.exports.run = async (bot, message, args) => {
  const target = message.mentions.users.first() || message.author;
  const user = await Points.findOne({
    where: {
      userId: target.id,
    },
  });
  if (!user) {
    return message.reply("**This user has not points**");
  }
  message.reply(`**${target.username} has ${user.wallet}$ **`);
};
module.exports.config = {
  name: "creadits",
  aliases: ["c"],
};
