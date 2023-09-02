const Discord = require('discord.js');
const formatDuration = require("../functions/convertTime/format");
const trackSchema = require(`${process.cwd()}/src/database/schemas/trackSchema.js`)
const LangSchema = require(`${process.cwd()}/src/database/schemas/language.js`)

module.exports = {
    name: "trackStart",
    async execute(client, player, track) {
        const DataLang = await LangSchema.findOne({ guildID: player.guildId });
        let language = DataLang.language;
        const stop = new Discord.ButtonBuilder().setStyle("Danger").setLabel(client.language[language]["Commands"]["Music"]["MusicButtons"]["Stop"]).setCustomId("stop")
        const skip = new Discord.ButtonBuilder().setStyle("Primary").setLabel(client.language[language]["Commands"]["Music"]["MusicButtons"]["Skip"]).setCustomId("skip")
        const pause = new Discord.ButtonBuilder().setStyle("Success").setLabel(client.language[language]["Commands"]["Music"]["MusicButtons"]["Pause"]).setCustomId("pause")
        const list = new Discord.ButtonBuilder().setStyle("Secondary").setLabel(client.language[language]["Commands"]["Music"]["MusicButtons"]["Playlist"]).setCustomId("playlist")
        const btn = new Discord.ActionRowBuilder().addComponents(pause, skip, stop, list)
        const trackDuration = track.info.isStream ? "LIVE" : formatDuration(track.info.length);
        const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: eval(client.language[language]["PoruEvents"]["TrackStart"]["SongRequesterBy"]),
                iconURL: track.info.requester.displayAvatarURL(),
            })
            .setDescription(`**[${track.info.title}](${track.info.uri})** ${language.replace("es", "de").replace("en", "of")} \`${(track.info.author)}\``)
            .addFields(
                { name: client.language[language]["PoruEvents"]["TrackStart"]["FieldLength"], value: `\`${trackDuration}\``, inline: true },
                { name: client.language[language]["PoruEvents"]["TrackStart"]["FieldList"], value: `${player.queue.length} ` + client.language[language]["PoruEvents"]["TrackStart"]["FieldListValue"], inline: true }
            )
            .setColor("Green")
            .setThumbnail(track.info.image);
        const channel = client.channels.cache.get(player.textChannel);
        const msg = await channel?.send({ embeds: [embed], components: [btn] }).catch(() => { return; })
        await trackSchema.findOneAndUpdate({ guildID: player.guildId }, { messageID: msg.id }, { new: true, upsert: true })
    }
};