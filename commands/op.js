const axios = require("axios");
const { connect } = require("mongoose");
const yts = require("yt-search");
const ytdl = require("ytdl-core");
const { Points } = require("../models");
const queue = new Map();
module.exports.run = async (bot, message, args) => {
  const url = "https://api.jikan.moe/v3/top/anime/1/bypopularity";

  const voice_channel = message.member.voice.channel;
  if(!voice_channel){
    return message.reply("You need to be in a voice channel");

  }  

  const permissions = voice_channel.permissionsFor(bot.user);

  if (!permissions.has("SPEAK"))
    return message.reply("I don't have the permissions");
  if (!permissions.has("CONNECT"))
    return message.reply("I don't have the permissions");
  axios.get(url).then(async (res) => {
    const anime = res.data.top[Math.floor(Math.random() * res.data.top.length)];
    const video = await yts(`${anime.title} op 1`);
    const song = { url: video.videos[0].url };
    console.log(song.url);
    const connection = await voice_channel.join();
    const stream = ytdl(song.url, { filter: "audioonly" });

    connection.play(stream);
    const filter = (m) => m.member.id === message.member.id;
    const collector = message.channel.createMessageCollector(filter, {
      time: 30000,
    });
    let answered = false;
    collector.on("collect", async (m) => {
      if (
        anime.title.toLowerCase().substring(0, 10) ===
        m.content.toLowerCase().substring(0, 10)
      ) {
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
        connection.dispatcher.end();
        message.channel.send(
          `<@${m.member.id}> **You got the answer and you earned ${points}$**`
        );
      }
    });
    collector.on("end", (m) => {
      if (!answered) {
        message.channel.send(`**Timeout the answer was ${anime.title}**`);
        connection.dispatcher.end();
      }
    });
  });
}

module.exports.config = {
  name: "op",
  aliases: ["op"],
};
