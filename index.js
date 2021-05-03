const Discord = require("discord.js");
const db = require("./models")
const client = new Discord.Client();
const Levels = require("discord-xp");
const config = require("./config");
const canvacord = require("canvacord");


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();


const fs = require("fs");
db.sequelize.sync()
.then(()=>{
  fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js") 
    if(jsfile.length <= 0) {
         return console.log("[LOGS] Couldn't Find Commands!");
    }

    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        client.commands.set(pull.config.name, pull);  
        pull.config.aliases.forEach(alias => {
            client.aliases.set(alias, pull.config.name)
        });
    });
});

Levels.setURL(
  "mongodb+srv://aymen35:bokuakirada02265@cluster0.i25p0.mongodb.net/Strelizia?retryWrites=true&w=majority"
);

const { prefix, token } = require("./config.json");
client.on("ready", () => {
  console.log(`Logged In As ${client.user.username}`);
});

client.on("message", async (message) => {
  if (message.author.bot) {
    return;
  }
  let prefix = config.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)))
  if(commandfile) commandfile.run(client,message,args)
  if(!message.content.startsWith(prefix)){
    const randomXP = Math.floor(Math.random() * 29) + 1;
    const LeveledUp = await Levels.appendXp(
      message.author.id,
      message.guild.id,
      randomXP,
    );
    if (LeveledUp) {
      const user = await Levels.fetch(message.author.id, message.guild.id);
      message.channel.send(
        `${message.author}, congratulations! You have leveled up to **${user.level}**`
      );
    }
  }
} )
    

  


client.login(token);

})

