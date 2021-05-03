const Discord = require("discord.js")

module.exports.run = async(bot,message,args)=>{
    const target = message.mentions.users.first() || message.author
    const avatar = target.displayAvatarURL({dynamic:true,size:1024})
    embed = new Discord.MessageEmbed()
    .setImage(avatar)
    .setDescription(`${target} Avatar`)
    .setFooter(`Requested by ${message.author.username}`,message.author.displayAvatarURL())
    message.channel.send(embed)
}

module.exports.config = {
    name:"avatar",
    aliases:["avatar"]
}