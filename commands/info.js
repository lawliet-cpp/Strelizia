const Discord = require("discord.js");
const axios = require("axios");
const paginationEmbed = require('discord.js-pagination');

module.exports.run = async (bot, message, args) => {
  query = "";
  args.forEach((arg) => {
    query += arg;
  });
  url = `https://api.jikan.moe/v3/search/anime?q=${query}&order_by=title&sort=asc&limit=10`;
  embeds = []
  
  axios.get(url)
  .then(response=>{
      const data = response.data.results;
      data.map(anime=>{
          
          embed = new Discord.MessageEmbed()
          .setTitle(anime.title)
          .setURL(anime.url)
          .setColor("#ebb5fa")
          .setAuthor("Strelizia",bot.user.displayAvatarURL())
          .setThumbnail(anime.image_url)
          .addField("Episodes",anime.episodes,true)
          .addField("Score",anime.score,true)
          .addField("Members",anime.members,true)
          .addField("Airing",anime.airing,true)
          .addField("Type",anime.type,true)
          .addField("MalID",anime.mal_id,true)
          .addField("Synopsis",anime.synopsis)
          .setFooter(`requested by ${message.author.username}`,message.author.displayAvatarURL())
        embeds.push(embed)
          
      })
      const timeout = "100000"
      const emojiList =  ["◀️","▶️"]
      paginationEmbed(message, embeds, emojiList, timeout);

  })
};

module.exports.config = {
    name:"info",
    aliases:["info","anime"]
}