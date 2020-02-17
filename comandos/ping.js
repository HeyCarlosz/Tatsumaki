const Discord = require('discord.js')

exports.run = (/** @type {Discord.Client} */ client, /** @type {Discord.Message} */ message, args)  => {
    message.channel.send(`:ping_pong: | Calculando latência, aguarde.`).then(msg1 => {
        msg1.edit(`${message.author}\n🏓 | Latência da mensagem editada: ` + `**${Date.now() - msg1.createdTimestamp}**` +'ms\n❤ | Batimento cardiaco: (ping - websocket) ' +Math.round(client.ping)+`ms`)
    })
}
