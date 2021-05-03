const Discord = require("discord.js");
const axios = require("axios");
const paginationEmbed = require("discord.js-pagination");






class Wrapper {
  constructor(url,bot,message,img) {
    this.url = url;
    this.bot = bot
    this.message = message
    this.img = img
  }
  getEmbeds() {
    this.message.react("<a:DzOtaku:739561320969666642>")
    this.message.channel.startTyping()
    axios.get(this.url).then((response) => {
      let embeds = [];
      const reviews = response.data.reviews;
      reviews.forEach(review=>{
          let content = review.content
          let description = content.substring(0,500)
          let embed = new Discord.MessageEmbed()
          .addField("Content",` <a:DzOtaku:739561320969666642> ${description} .....`,false)
          .setAuthor(review.reviewer.username,review.reviewer.image_url)
          .setThumbnail(img)
          .addField("<a:DzOtaku:739561320969666642> Overral",review.reviewer.scores.overall,true)
          .addField("<a:DzOtaku:739561320969666642> Story",review.reviewer.scores.story,true)
          .addField("<a:DzOtaku:739561320969666642> Animation",review.reviewer.scores.animation,true)
          .addField("<a:DzOtaku:739561320969666642> Sound",review.reviewer.scores.sound,true)
          .addField("<a:DzOtaku:739561320969666642> Enjoyment ",review.reviewer.scores.enjoyment,true)
          .addField("<a:DzOtaku:739561320969666642> Written By",`${review.reviewer.username}`,true)
          .addField("<a:DzOtaku:739561320969666642> Full Review Link",review.url,false)
          embeds.push(embed)


      })
      const timeout = "100000"
      const emojiList =  ["◀️","▶️"]
      paginationEmbed(this.message, embeds, emojiList, timeout);
      this.message.channel.stopTyping();

     
     
    });
   
    
  }
}
module.exports.run = async (bot, message, args) => {
  query = "";
  args.forEach((arg) => {
    query += arg;
  });

  q_url = `https://api.jikan.moe/v3/search/anime?q=${query}&order_by=title&sort=asc&limit=1`;
  axios.get(q_url).then((res) => {
    results = res.data.results;
    results.forEach((result) => {
      id = result.mal_id;
      url = `https://api.jikan.moe/v3/anime/${id}/reviews/`;
      img = result.image_url;
      wrapper = new Wrapper(url,bot,message,img);

      wrapper.getEmbeds()
      
    });
  });
};

module.exports.config = {
  name: "review",
  aliases: ["reviews", "review"],
};
