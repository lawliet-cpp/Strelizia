const Discord = require("discord.js")
const axios = require("axios")
module.exports.run = async (bot,message,args)=>{
    if(!message.mentions.users.first()){
        return message.reply("You need to mention someone to kiss")
    }
    if(message.mentions.users.first().id ===message.author.id){
        return message.reply("You can't kiss yourself")
    }
    axios.get("https://nekos.life/api/kiss")
    .then(response=>{
        data = response.data
        embed = new Discord.MessageEmbed()
        .setImage(data.url)
        .setDescription(`${message.author} kissed ${message.mentions.users.first()}`)
        message.reply(embed)
    })
}

module.exports.config = {
    name:"kiss",
    aliases:["kiss"]
}