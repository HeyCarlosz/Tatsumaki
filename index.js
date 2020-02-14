console.log("Starting...")
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client({
	autoReconnect: true,
	disableEveryone: true
});
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./comandos/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log(`Hello World! Logged in as ${client.user.tag}!\n\n`);
	client.user.setPresence({
		status: "idle",
		game: {
			name: `${client.users.size} seres humanos!`,
			type: "WATCHING"
		}
	})
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(erro.stack);
		message.reply('Tivemos um erro no comando que você pediu!');
	}
});

client.login(token);