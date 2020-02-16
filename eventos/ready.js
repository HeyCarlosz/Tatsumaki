exports.run = async (client, message) => {
    console.log(`Hello World! Logged in as ${client.user.tag}!\n\n`);
    client.user.setPresence({
        status: "idle",
        game: {
            name: `${client.users.size} seres humanos!`,
            type: "WATCHING"
        }
    })
}