const Discord = require('discord.js');
const botconfig = require("../config.json");

exports.run = async (client, message) => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;
    const prefix = botconfig.prefix

    if (message.content.startsWith(prefix)) {
        let command = message.content.split(" ")[0];
        command = command.slice(prefix.length);        
            let args = message.content.slice(prefix.length).trim().split(' ');
            if (!message.content.startsWith(prefix)) return;
            try {
                delete require.cache[require.resolve(`../comandos/${command}.js`)];
                let commandFile = require(`../comandos/${command}.js`)
                commandFile.run(client, message, args, prefix)
                client.guilds.get('663004260975247373').channels.get('663027020439224320').send(`[COMMANDS LOG] ${message.author.username}/${message.author.id} usou o comando **${command}** no server ${message.guild.name}/${message.guild.id}`)
                //console.log("[COMMANDS LOG] " + message.author.username + " usou o comando " + command + " no server " + message.guild.name)
            } catch (erro) {
                console.log(erro.stack);
    
    }
    } else {
        if(message.content.includes(`<@${client.user.id}>`) || message.content.includes(`<@!${client.user.id}>`)) {
            message.delete();
              
            message.channel.send(`Onii-chan ${message.author}, use ${prefix}ajuda para ver meu painel de ajuda! <a:disclove:677169521387110412>`)
        }
    }
}