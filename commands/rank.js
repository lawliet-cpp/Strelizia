const Discord = require("discord.js")
const Levels = require("discord-xp")
const canvacord = require("canvacord")
module.exports.run = async (bot,message,args)=>{
    const target = message.mentions.users.first() || message.author; // Grab the target.

      const user = await Levels.fetch(target.id, message.guild.id, true); // Selects the target from the database.

      if (!user)
        return message.channel.send(
          "Seems like this user has not earned any xp so far."
        ); // If there isnt such user in the database, we send a message in general.
      
      
      //do some coloring for user status cause cool
     
      const rank = new canvacord.Rank()
        .setAvatar(target.displayAvatarURL({ dynamic: false, format: "png" }))
        .setCurrentXP(user.cleanXp)
        .setRequiredXP(user.cleanNextLevelXp)
        .setStatus("online")
        .setProgressBar("#00fa81", "COLOR")
        .setUsername(target.username)
        .setDiscriminator(target.discriminator)
        .setLevel(user.level)
        .setRank(user.position)
        .setRankColor("#00fa81")
        .setLevelColor("#00fa81")

      rank.build().then(data => {
        const attachment = new discord.MessageAttachment(data, "RankCard.png");
        message.channel.send(attachment);
      });
    
}
module.exports.config = {
    name:"rank",
    aliases:["rank"]
}