const Discord = require("discord.js");
const axios = require("axios");
const paginationEmbed = require('discord.js-pagination');

module.exports.run = async (bot, message, args) => {
  query = "";
  args.forEach((arg) => {
    query += arg;
  });
  url = `https://api.jikan.moe/v3/search/manga?q=${query}&order_by=title&sort=asc&limit=10`;
  embeds = []
  axios.get(url)
  .then(response=>{
      const data = response.data.results;
      data.map(manga=>{
          embed = new Discord.MessageEmbed()
          .setTitle(manga.title)
          .setURL(manga.url)
          .setColor("#ebb5fa")
          .setAuthor("Strelizia",bot.user.displayAvatarURL())
          .setThumbnail(manga.image_url)
          .addField("Volumes",manga.volumes,true)
          .addField("Chapters",manga.chapters,true)
          .addField("Score",manga.score,true)
          .addField("Members",manga.members,true)
          .addField("Type",manga.type,true)
          .addField("MalID",manga.mal_id,true)
          .addField("Synopsis",manga.synopsis)
          .setFooter(`requested by ${message.author.username} `,message.author.displayAvatarURL())
        embeds.push(embed)
          
      })
      const timeout = "100000"
      const emojiList =  ["◀️","▶️"]
      paginationEmbed(message, embeds, emojiList, timeout);

  })
};

module.exports.config = {
    name:"manga",
    aliases:["manga"]
}