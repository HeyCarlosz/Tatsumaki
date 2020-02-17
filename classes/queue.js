const yt = require('ytdl-core')
const Discord = require('discord.js')

module.exports = class Queue {
    constructor(client, guild, connection, channel) {
        this.guild = guild
        this.connection = connection
        /**@type {Discord.TextChannel} */
        this.channel = channel
        /**@type {Discord.Client} */
        this.client = client

        this.songs = []
        /**@type {Discord.StreamDispatcher} */
        this.dispatcher;

        this.loop = false;
        this.qloop = false;
        this.playing = false;
    }

    disconnect() {
        this.playing = false;
        this.songs = undefined
        this.dispatcher = undefined
        this.connection.disconnect();
        this.client.queues[this.guild.id] = undefined
    }

    addSong(s) {
        let added = 0;
        for (let i = 0; i < s.length; i++) {
            const song = s[i];

            if (song == null || song.url == null) continue;
            this.songs.push(song)
            added++
        }

        if (s.length < 1) throw "Erro na adicao de musicas, queue.js (classe):\ns.length < 1"

        if (s.length > 1) {
            console.log(`${s.length} Musicas adicionadas a queue da guild "${this.channel.guild.name}"`)
            this.channel.send({
                "embed": {
                    "color": 0x00ff00,
                    "fields": [{
                        "name": `Playlist adicionada <a:musica:672432375895949322>`,
                        "value": `**${added}** Musicas`
                    }]
                }
            })
        } else {
            console.log(`A musica "${s[0].name}" foi adicionada a guild "${this.channel.guild.name}"`)

            this.channel.send({
                "embed": {
                    "color": 0x00ff00,
                    "fields": [{
                        "name": "Musica adicionada <a:musica:672432375895949322>",
                        "value": s[0].name.replace('official video', ' ')
                    }]
                }
            })
        }

        if (!this.playing) this.play()
    }

    play() {
        if (this.songs.length == 0) this.disconnect()

        if (!this.songs[0].url) {
            this.songs.shift()
        }

        this.playing = true;

        this.dispatcher = this.connection.playStream(yt(this.songs[0].url, {
                filter: 'audioonly'
            }), {
                bitrate: 'auto'
            })
            .on('end', () => {
                if (!this.songs) return this.disconnect()

                if (this.qloop && !this.loop) {
                    let s = this.songs.shift()
                    this.addSong(s.url, s.name)
                } else if (!this.loop) {
                    console.log(`Musica ${this.songs[0].name} foi removida da queue Guild ${this.guild.name}`)
                    this.songs.shift()
                }

                if (this.songs.length == 0) {
                    this.disconnect()
                    return console.log(`Saindo do canal de voz Guild ${this.guild.name}`)
                }

                console.log(`Proxima musica "${this.songs[0].name}" Guild "${this.guild.name}"`)

                this.play()
            })
            .on('error', (err) => console.log(err))
    }
}