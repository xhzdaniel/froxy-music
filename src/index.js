const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { ClusterClient, getInfo } = require("discord-hybrid-sharding");
const { Poru } = require('poru');
const fs = require('fs');
require('dotenv').config();
require('colors');

const client = new Client({
    shards: getInfo().SHARD_LIST,
    shardCount: getInfo().TOTAL_SHARDS,
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents
    ],
    partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message],
    allowedMentions: {
        parse: ["roles", "users"],
        repliedUser: false,
    }
})

client.slashCommands = new Collection();
client.slashArray = [];

client.language = {};
let languages = fs.readdirSync(`${process.cwd()}/src/lang/`).filter(archive => archive.endsWith(".json")).map(language => language.replace(/.json/, ""));
for (const language of languages) {
    client.language[language] = require(`${process.cwd()}/src/lang/${language}`)
}
Object.freeze(client.language);

//PUEDES COMPRAR TU SERVIDOR DE LAVALINK PARA PODER REPRODUCIR MÚSICA EN https://clients.kuinzhosting.com/index.php?rp=/store/otros-servicios/lavalink
const node = [
    {
        name: "Node 1",
        host: "IP DEL HOST",
        port: "PUERTO DEL HOST",
        password: "CONTRASEÑA DEL HOST",
        secure: false
    },
]
//PUEDES COMPRAR TU SERVIDOR DE LAVALINK PARA PODER REPRODUCIR MÚSICA EN https://clients.kuinzhosting.com/index.php?rp=/store/otros-servicios/lavalink

client.poru = new Poru(client, node, {
    library: "discord.js",
    reconnectTime: 0,
    resumeKey: "MyPlayers",
    resumeTimeout: 60,
    clientID: 'cb41529dc3bd4d8f8a240dbee0fff4e8',
    clientSecret: 'bcca82f42930498aa385a8289fdf276b',
    playlistLimit: 5,
    send(guildId, payload) {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload)
    }
});

fs.readdirSync(`${process.cwd()}/src/structures`).forEach(structures => {
    try {
        require(`${process.cwd()}/src/structures/${structures}`)(client);
    } catch (e) {
        console.log(`(x) ERROR EN LA ESTRUCTURA ${structures}`.red)
        console.log(e)
    }
});

client.cluster = new ClusterClient(client)
client.login(process.env.TOKEN)