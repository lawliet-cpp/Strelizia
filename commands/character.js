const axios = require("axios")
const Discord = require("discord.js")
module.exports.run = async(bot,message,args)=>{
    let answered = false
    const url = "https://api.jikan.moe/v3/top/characters"
    axios.get(url)
    .then(res=>{
        const data = res.data;
        const char = data.top[Math.floor(Math.random() * data.top.length)]
        const embed = new Discord.MessageEmbed()
        .setImage(char.image_url)
        .setTitle("Guess tha character Name")
        message.channel.send(embed)
        const filter = (m)=>m.author.id===message.author.id
        const collector = message.channel.createMessageCollector(filter,{time:15000})
        const names = char.title.split(",")
        
       for(let i=0; i<names.length;i++){
           names[i] = names[i].toLowerCase().replace(" ","")
       }
        console.log(names)
        collector.on("collect",(m)=>{
            if (names.includes(m.content)){
                message.reply("** You got it correct **")
                answered = true
            }
        })
        collector.on("end",()=>{
            if(!answered){
                message.channel.send(`**Timeout The Answer Was ${char.title}**`)
            }
        
        })
    })
}

module.exports.config = {
    name:"character",
    aliases:["sg"]
}