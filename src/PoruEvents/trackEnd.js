const Discord = require("discord.js")
const trackSchema = require(`${process.cwd()}/src/database/schemas/trackSchema.js`);
const LangSchema = require(`${process.cwd()}/src/database/schemas/language.js`);
module.exports = {
    name: "trackEnd",
    async execute(client, player) {
        const DataLang = await LangSchema.findOne({ guildID: player.guildId });
        let language = DataLang.language;
            const end = new Discord.ButtonBuilder().setStyle("Secondary").setLabel(client.language[language]["ButtonMusicEnd"]).setCustomId("end").setDisabled(true)
            const data = await trackSchema.findOne({ guildID: player.guildId })
            client.channels.cache.get(player.textChannel).messages.fetch(data.messageID).then(msg => msg.edit({ components: [new Discord.ActionRowBuilder().addComponents(end)] })).catch(() => { return; });
    }
};