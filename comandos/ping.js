module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args) {
		message.channel.send(`:ping_pong: | Calculando latência, aguarde.`).then(msg1 => {
			msg1.edit(`${message.author}\n🏓 | Latência da mensagem editada: ` + `**${Date.now() - msg1.createdTimestamp}**` + 'ms\n❤ | Batimento cardiaco: (ping - websocket) ' + Math.round(message.client.ping) + `ms`)
		});
	},
};