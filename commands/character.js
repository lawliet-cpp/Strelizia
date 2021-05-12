const axios = require("axios");
const {Points } = require("../models")
const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {
  let answered = false;
  const url = "https://api.jikan.moe/v3/top/characters";
  axios.get(url).then((res) => {
    const data = res.data;
    const char = data.top[Math.floor(Math.random() * data.top.length)];
    const embed = new Discord.MessageEmbed()
      .setImage(char.image_url)
      .setTitle("Guess tha character Name");
    message.channel.send(embed);
    const filter = (m) => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector(filter, {
      time: 15000,
    });
    const names = char.title.split(",");

    for (let i = 0; i < names.length; i++) {
      names[i] = names[i].toLowerCase().replace(" ", "");
    }
    console.log(names);
    collector.on("collect", async(m) => {
      if (names.includes(m.content)) {
        const points = Math.floor(Math.random() * 10)
       
        let user = await Points.findOne({
          where:{
            userId:m.member.id
          }
        })
        if(!user){
          console.log("This User Does Not Exist")
        }else{
          user.wallet+= points
          user.save()
          message.reply(`** You got it correct  $${points} added **`);

        }
        answered = true;
      }
    });
    collector.on("end", () => {
      if (!answered) {
        message.channel.send(`**Timeout The Answer Was ${char.title}**`);
      }
    });
  });
};

module.exports.config = {
  name: "character",
  aliases: ["sg"],
};
