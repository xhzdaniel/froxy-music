const { ActivityType, PresenceUpdateStatus } = require('discord.js');
const { connect } = require('mongoose')
module.exports = ("ready", async (client) => {
    client.poru.init(client)

    client.user.setPresence({
        activities: [{ name: process.env.STATUS, type: ActivityType[process.env.STATUS_TYPE] ?? ActivityType.Watching }],
        status: PresenceUpdateStatus.Online,
    });

    console.log("Conectando a la base de datos".blue)
    connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log(`Conectado a la base de datos de MongoDB`.green)
    }).catch((err) => {
        console.log(`Error al conectar a la base de datos de MongoDB`.bgRed);
        console.log(err);
    });

    console.log(`Conectado como ${client.user.tag}`.green);
    if (client?.application?.commands) {
        client.application.commands.set(client.slashArray);
        console.log(`(/) ${client.slashCommands.size} Comandos Publicados`.green);
    }
})

