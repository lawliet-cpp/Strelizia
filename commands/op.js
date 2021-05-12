const axios = require("axios");
const { connect } = require("mongoose");
const yts = require("yt-search");
const ytdl = require("ytdl-core");
const { Points } = require("../models");
const { API_KEY } = require("../config.json");
const queue = new Map();
var stringSimilarity = require("string-similarity");
let playing = false;

module.exports.run = async (bot, message, args) => {
  if(playing){
    return message.reply("** I'm Afraid that you can't play until the current song ends **")
  }
  const url = "https://api.jikan.moe/v3/top/anime/1/bypopularity";

  const voice_channel = message.member.voice.channel;
  if (!voice_channel) {
    return message.reply("You need to be in a voice channel");
  }

  const permissions = voice_channel.permissionsFor(bot.user);

  if (!permissions.has("SPEAK"))
    return message.reply("I don't have the permissions");
  if (!permissions.has("CONNECT"))
    return message.reply("I don't have the permissions");
  axios.get(url).then(async (res) => {
    const anime = res.data.top[Math.floor(Math.random() * res.data.top.length)];

    const query = anime.title + " op";
    const connection = await voice_channel.join();
    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${query}&key=${API_KEY}`;
    axios.get(url).then((res) => {
      const data = res.data;
      const video = data.items[0];
      const id = video.id.videoId;
      
      play(id, connection)
      playing=true
      

      
    });

    const filter = (m) => m.channel.id === message.channel.id;
    const collector = message.channel.createMessageCollector(filter, {
      time: 30000,
    });
    let answered = false;
    collector.on("collect", async (m) => {
       var similarity = stringSimilarity.compareTwoStrings(m.content,anime.title );
       if(!m.author.bot){
         console.log(similarity)
       }
       if(similarity >= 0.55){
        const points = Math.floor(Math.random() * 30);
        let user = await Points.findOne({
          where: {
            userId: m.member.id,
          },
        });

        if (!user) {
          user = await Points.create({ userId: m.member.id, wallet: points });
        } else {
          user.wallet += points;
          user.save();
        }
        answered = true;
        playing=false;
        connection.dispatcher.end();
        message.channel.send(
          `<@${m.member.id}> **You got the answer and you earned ${points}$**`
        );
      }
    });
    collector.on("end", (m) => {
      if (!answered) {
        message.channel.send(`**Timeout the answer was ${anime.title}**`);
        try{
          connection.dispatcher.end();
          playing=false

        }catch{
          playing=false
        }
        
      }
    });
  });
};
const play = async (id, connection,playing) => {
  const stream = await ytdl(id, { filter: "audioonly" });
  connection.play(stream);

  
  

};

module.exports.config = {
  name: "op",
  aliases: ["op"],
};
