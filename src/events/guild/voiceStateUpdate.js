const Discord = require('discord.js')
const trackSchema = require(`${process.cwd()}/src/database/schemas/trackSchema.js`)
const panelSchema = require(`${process.cwd()}/src/database/schemas/panelSchema.js`)

module.exports = async (client, oldVoice, newVoice) => {
    const player = client.poru.players.get(oldVoice.guild.id);
    if (!player) return;

    const dataPanel = await panelSchema.findOne({ guildID: player.guildId });
    if (player.textChannel === dataPanel?.channelID) {
        return;
    } else {
        if (!newVoice.guild.members.me.voice.channel) {
            const end = new Discord.ButtonBuilder().setStyle("Secondary").setLabel("Canción finalizada").setCustomId("end").setDisabled(true)
            const data = await trackSchema.findOne({ guildID: player.guildId })
            oldVoice.guild.channels.cache.get(player.textChannel).messages.fetch(data?.messageID).then(msg => msg.edit({ components: [new Discord.ActionRowBuilder().addComponents(end)] })).catch(() => { return; });
            player.destroy();
        }
    }
};