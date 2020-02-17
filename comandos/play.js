const Discord = require('discord.js')
const Queue = require('../classes/queue.js')
const he = require('he')

exports.run = ( /** @type {Discord.Client} */ client, /** @type {Discord.Message} */ message, args) => {

    const youtube = client.youtube
    const sp = client.sp

    const guild = message.guild
    let queues = client.queues

    if (!message.member.voiceChannel) return message.reply("Voce nao esta em um Voice channel");

    if (args.length == 0) return message.reply("Especifique um video para ser tocado!");

    message.member.voiceChannel.join()
        .then(connection => {

            let queue = client.queues[guild.id]

            if (queue === undefined) {
                queues[guild.id] = new Queue(client, guild, connection, message.channel)
                queue = queues[guild.id]
            }

            let searchQuery = args.join(" ")

            let service = args[0].replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split(".")[0].toLowerCase()

            let ytOptions = {
                part: 'snippet',
                videoEmbeddable: 'true',
                type: 'video',
                safeSearch: 'none',
                videoCategoryId: 10
            }
            let sufix = `official video`

            if (service == "youtube" || service == "youtu") {
                youtube.getPlaylist(args[0])
                    .then(playlist => {
                        playlist.getVideos(50)
                            .then(videos => {
                                console.log(`Uma playlist foi adicionada ${playlist.title}\n`)
                                let songs = []

                                videos.forEach(video => {
                                    songs.push({
                                        "name": video.title,
                                        "url": video.url
                                    })
                                });
                                queue.addSong(songs)
                            })
                            .catch(err => console.log(err))
                    })
                    .catch(() => {
                        youtube.getVideo(args[0])
                            .then(video => {
                                queue.addSong([{
                                    "name": video.title,
                                    "url": video.url
                                }])
                            })
                            .catch((err) => {
                                if (err) return console.log(`Erro ao pegar um video por link em play.js\n${err}`)
                                youtube.searchVideos(searchQuery, 1)
                                    .then(search => {
                                        let video = search[0]

                                        queue.addSong([{
                                            "name": video.title,
                                            "url": video.url
                                        }])
                                    })
                                    .catch(err => console.log(`Erro em search term em play.js\n${err}`))

                            })
                            .catch(err => console.log(err))
                    })  
            } else if (service == "open") {

                let index = args[0].search(/(playlist|track|album)/)
                let parsed = args[0].substr(index).split("/")
                let type = parsed[0]
                let id = parsed[1]

                if (type == "track") {
                    sp.getTrack(id)
                        .then(data => {
                            let title = `${data.body.name} - ${data.body.artists[0].name}`

                            youtube.searchVideos(`${title} ${sufix}`, 1, ytOptions)
                                .then(videos => videos.forEach(video => {

                                    let r = new RegExp(title.split(`-`)[0].trim(), 'i')
                                    if (he.decode(video.title).trim().search(r) == -1) {
                                        message.channel.send({
                                            "embed": {
                                                "color": 0x00ff00,
                                                "fields": [{
                                                    "name": `Musica nao encontrada`,
                                                    "value": `A musica **'${title}'** nao foi encontrada no youtube`
                                                }]
                                            }
                                        })
                                        .catch(err => console.log(err))

                                        if (queue.songs.length < 1) connection.disconnect();
                                        return;
                                    }

                                    queue.addSong([{
                                        "name": `${title}`,
                                        "url": video.url
                                    }])

                                    console.log(video.url)
                                }))
                        })
                        .catch(err => console.error(err))

                } else if (type == "album") {
                    console.log(`Found album`)
                    sp.getAlbumTracks(id)
                        .then(data => {
                            let songs = []

                            let items = data.body.items != undefined ? data.body.items : data.body.tracks.items

                            for (item of items) {
                                if (!songs.push) return

                                songs.push({
                                    name: `${item.name} - ${item.artists[0].name}`,
                                    url: null
                                })
                            }

                            let tempS = songs

                            let length = songs.length
                            let j = 0;
                            for (let i = 0; i < length; i++) {

                                let sq = `${songs[i].name} ${sufix}`
                                youtube.searchVideos(sq, 1, ytOptions)
                                    .then(video => {
                                        if (!tempS[i] || !video[0]) return console.log(`ERROR on the start`)

                                        let r = new RegExp(tempS[i].name.split(`-`)[0].trim(), 'i')
                                        if (he.decode(video[0].title).trim().search(r) == -1) {
                                            console.log(tempS[i].name.split(`-`)[0] + ` || ${he.decode(video[0].title)}`)
                                        } else {
                                            songs[i].url = video[0].url
                                            console.log(video[0].url)
                                        }

                                        if (j >= length - 1) {
                                            console.log(`finished`)
                                            queue.addSong(songs)
                                        }

                                        j++
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                            }
                        })
                        .catch(err => console.error(err))
                } else if (type == "playlist") {
                    sp.getPlaylistTracks(id)
                        .then(data => {

                            let songs = []

                            let items = data.body.items != undefined ? data.body.items : data.body.tracks.items

                            for (item of items) {
                                if (!songs.push) return

                                songs.push({
                                    name: `${item.track.name} - ${item.track.artists[0].name}`,
                                    url: null
                                })
                            }

                            let tempS = songs

                            let length = songs.length
                            let j = 0;
                            for (let i = 0; i < length; i++) {

                                let sq = `${songs[i].name} ${sufix}`
                                youtube.searchVideos(sq, 1, ytOptions)
                                    .then(video => {
                                        if (!tempS[i] || !video[0]) return console.log(`ERROR on the start`)

                                        let r = new RegExp(tempS[i].name.split(`-`)[0].trim(), 'i')
                                        if (he.decode(video[0].title).trim().search(r) == -1) {
                                        } else {
                                            songs[i].url = video[0].url
                                        }

                                        if (j >= length - 1) {
                                            console.log(`finished`)
                                            queue.addSong(songs)
                                        }

                                        j++
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                            }
                        })
                        .catch(err => console.error(err))
                }
            } else {
                youtube.searchVideos(`${searchQuery}`, 1)
                    .then(search => {
                        let video = search[0]
                        if (!video) return message.reply(`Nenhum video foi encontrado com esse nome`)
                        queue.addSong([{
                            "name": video.title,
                            "url": video.url
                        }])
                    })
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
}