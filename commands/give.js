const { UserFlags } = require("discord.js")
const {Points} = require("../models")
module.exports.run = async(bot,message,args)=>{
    const amount  =Number(args[1])
    const target = message.mentions.users.first()
    
        const sender = await Points.findOne({
            where:{
                userId:message.author.id
            }
        })
        const revciever = await Points.findOne({
            where:{
                userId:target.id
            }
        })
        if(amount > sender.wallet) return message.reply("You don't have enough money")
        if(!sender) return message.reply("**You don't  exist in our database**")
        if(!revciever) return message.reply("This user does not exist in our database")

        sender.wallet -=amount
        revciever.wallet += amount
        sender.save()
        revciever.save()
        message.reply(`**Done ${amount}$ have been transfered**`)
        
        

    
        
        
    
}
module.exports.config = {
    name:"give",
    aliases:["give"]
}