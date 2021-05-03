const ytdl = require('discord-ytdl-core');
const { GuildEmoji } = require('discord.js');
const ytSearch = require('yt-search');

//Global queue for your bot. Every server will have a key and value pair in this map. { guild.id, queue_constructor{} }
const queue = new Map();

module.exports.run = async(bot,message,args)=>{
    const voice_channel = message.member.voice.channel
    if (!voice_channel) return message.channel.send("**You need to be in a voice channel**")
    const permissions = voice_channel.permissionsFor(bot.user)
    if(!permissions.has("CONNECT")) return message.channel.send("**I don't have the required Permission**")
    if(!permissions.has("SPEAK")) return message.channel.send("**I don't have the required Permissions**")
    if( message.content.startsWith("splay")){
    let song = {}
    const connection = await voice_channel.join()
    const server_queue = queue.get(message.guild.id)
   
    const argument = args[0]
    const valid = ytdl.validateURL(argument)
    if(valid){
       
        vid_info = await ytdl.getInfo(argument)
        const title = vid_info.videoDetails.title
        const song_url = vid_info.videoDetails.video_url
        song = {title:title,url: song_url}

    }else{
        let query = ""
        args.forEach(arg=>{
            query+=arg
            query+=" "
        })
        console.log(query)
        videos_result =  await ytSearch(query)

        song = {title:videos_result.videos[0].title,url:videos_result.videos[0].url}

    }
    if (!server_queue){
        queue_constructor = {
            songs:[],
            connection:null,
            voice_channel:null,
            text_channel:null
        }
        queue.set(message.guild.id,queue_constructor)
        queue_constructor.songs.push(song)
        try{
            queue_constructor.connection = connection;
            queue_constructor.voice_channel = voice_channel
            queue_constructor.text_channel = message.channel
            play(message.guild,song)
            
           
        }catch(err){
            console.log(err)
            message.channel.send("**Cannot play the song**")
        }
    }else{
        queue_constructor.songs.push(song)
        message.channel.send(`**${song.title} Added To The Queue**`)
    }
    }
    
    if(message.content.startsWith("sskip")){
        skip(message.guild)
    }
    if(message.content.startsWith("sstop")){
        stop(message.guild)
    }
    
    
}

const play = async(guild,song)=>{
    const server_queue = queue.get(guild.id)
    if (!song){
        server_queue.voice_channel.leave()
        queue.delete(guild.id)
    }else{
        const stream = ytdl(song.url,{
            filter: "audioonly",
            opusEncoded: false,
            fmt:"mp3",
            encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
        })
        server_queue.text_channel.send(`**Playing ${song.title}**`)
        server_queue.connection.play(stream)
        .on("finish",()=>{
            server_queue.songs.shift()
            play(guild,server_queue.songs[0])
        })

    }
   
    

}




const skip =async(guild)=>{
    try{
        server_queue = queue.get(guild.id)
        server_queue.connection.dispatcher.end()

    }catch(err){
        console.log(err)
    }
}


const stop = async(guild)=>{
    server_queue  = queue.get(guild.id)
    queue.delete(server_queue)
    server_queue.connection.dispatcher.end()

}

module.exports.config = {
    name:"play",
    aliases:["play","skip","stop"]
}