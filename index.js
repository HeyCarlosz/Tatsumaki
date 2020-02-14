console.log("Starting...")
const Discord = require('discord.js');
const client = new Discord.Client({
    autoReconnect: true,
    disableEveryone: true
});
const botconfig = require("./config.json");

client.on('ready', () => {
    console.log(`Hello World! Logged in as ${client.user.tag}!\n\n`);
    client.user.setPresence({
        status: "idle",
        game: {
            name: `${client.users.size} seres humanos!`,
            type: "WATCHING"
        }
    })
})
  
client.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return

    const prefixo = botconfig.prefix
    const command = message.content.split(" ")[0];
    command = command.slice(prefixo.length);
          
        const args = message.content.slice(prefixo.length).trim().split(' ');
        if (!message.content.startsWith(prefixo)) return;   
            try {
                delete require.cache[require.resolve(`./comandos/${command}.js`)];
                const commandFile = require(`./comandos/${command}.js`)
                commandFile.run(client, message, args, prefixo)
            } catch (erro) {
            console.log(erro.stack); 
}});

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return
    const prefixo = botconfig.prefix

    if(message.content.includes(`<@${client.user.id}>`) || message.content.includes(`<@!${client.user.id}>`)) {
        message.delete();
          
        message.channel.send(`Onii-chan ${message.author}, use ${prefixo}ajuda para ver meu painel de ajuda! <a:disclove:677169521387110412>`)
    }
});

client.login(botconfig.token)
