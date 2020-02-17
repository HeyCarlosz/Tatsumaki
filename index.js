console.log("Starting...")
const Discord = require('discord.js');
const client = new Discord.Client({
    autoReconnect: true,
    disableEveryone: true
});
const fs = require("fs"); 
const Enmap = require("enmap");
const botconfig = require("./config.json");
const Youtube = require('simple-youtube-api');

client.youtube = new Youtube("YouTube Token");
client.queues = {}
client.commands = new Enmap();
fs.readdir("./comandos/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./comandos/${file}`);
      let commandName = file.split(".")[0];
      client.commands.set(commandName, props);
  });
});

fs.readdir("./eventos/", (err, files) => { 
    if (err) return console.error(err);
    files.forEach(file => { 
        let eventFunction = require(`./eventos/${file}`); 
        let eventName = file.split(".")[0]; 
        client.on(eventName, (...args) => 
        eventFunction.run(client, ...args)); 
    }); 
});

client.on("error", (aa) => console.error(aa)); 
client.on("warn", (aa) => console.warn(aa));
client.login(botconfig.token).catch(aa => {
    console.log(`Ocorreu um erro ao tentar logar.\n${aa}`);
})
