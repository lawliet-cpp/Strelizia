const Discord = require("discord.js")

module.exports.run = async (bot,message,args)=>{
    await message.reply("pong");
}

module.exports.config = {
    name:"ping",
    aliases:["ping"]
}