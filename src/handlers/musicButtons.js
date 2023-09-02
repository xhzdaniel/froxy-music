const Discord = require("discord.js");
const formatDuration = require("../functions/convertTime/format");
const LangSchema = require(`${process.cwd()}/src/database/schemas/language.js`)

module.exports = client => {
    client.on("interactionCreate", async interaction => {
        if (interaction.isButton) {
            const player = client.poru.players.get(interaction.guildId);
            const DataLang = await LangSchema.findOneAndUpdate({ guildID: interaction.guild.id });
            let language = DataLang.language;
            if (interaction.customId === 'skip') {
                if (!interaction.member.voice?.channel)
                    return interaction.reply({
                        embeds: [new Discord.EmbedBuilder()
                            .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(client.language[language]["NoUserChannel"])
                            .setColor("Red")], ephemeral: true
                    })

                if (interaction.guild.members.me.voice?.channel && interaction.member.voice?.channel.id != interaction.guild.members.me.voice?.channel.id)
                    return interaction.reply({
                        embeds: [new Discord.EmbedBuilder()
                            .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(client.language[language]["UserAndBotChannel"])
                            .setColor("Red")], ephemeral: true
                    })
                if (!player) return interaction.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                        .setDescription(client.language[language]["NoMusic"])
                        .setColor("Red")], ephemeral: true
                })
                await interaction.deferUpdate().catch(() => {
                    return;
                })
                await player.stop();
            }
            if (interaction.customId === "stop") {
                if (!interaction.member.voice?.channel)
                    return interaction.reply({
                        embeds: [new Discord.EmbedBuilder()
                            .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(client.language[language]["NoUserChannel"])
                            .setColor("Red")], ephemeral: true
                    })

                if (interaction.guild.members.me.voice?.channel && interaction.member.voice?.channel.id != interaction.guild.members.me.voice?.channel.id)
                    return interaction.reply({
                        embeds: [new Discord.EmbedBuilder()
                            .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(client.language[language]["UserAndBotChannel"])
                            .setColor("Red")], ephemeral: true
                    })
                if (!player) return interaction.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                        .setDescription(client.language[language]["NoMusic"])
                        .setColor("Red")], ephemeral: true
                })
                const msg = interaction.message
                const end = new Discord.ButtonBuilder().setStyle("Secondary").setLabel(client.language[language]["ButtonMusicEnd"]).setCustomId("end").setDisabled(true)
                await msg.edit({ embeds: [msg.embeds[0]], components: [new Discord.ActionRowBuilder().addComponents(end)] })
                await player.destroy();
                await interaction.deferUpdate().catch(() => {
                    return;
                })
            }
            if (interaction.customId === "playlist") {
                if (!interaction.member.voice?.channel)
                    return interaction.reply({
                        embeds: [new Discord.EmbedBuilder()
                            .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(client.language[language]["NoUserChannel"])
                            .setColor("Red")], ephemeral: true
                    })
                if (interaction.guild.members.me.voice?.channel && interaction.member.voice?.channel.id != interaction.guild.members.me.voice?.channel.id)
                    return interaction.reply({
                        embeds: [new Discord.EmbedBuilder()
                            .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(client.language[language]["UserAndBotChannel"])
                            .setColor("Red")], ephemeral: true
                    })
                if (!player) return interaction.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                        .setDescription(client.language[language]["NoMusic"])
                        .setColor("Red")], ephemeral: true
                })

                const queue = player.queue.length > 9 ? player.queue.slice(0, 9) : player.queue;
                if (!queue)
                    return interaction.reply({
                        embeds: [new Discord.EmbedBuilder()
                            .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(client.language[language]["NoPlaylist"])
                            .setColor("Red")], ephemeral: true
                    })
                const trackDuration = player.currentTrack.info.isStream ? "LIVE" : formatDuration(player.currentTrack.info.length);
                const embed = new Discord.EmbedBuilder()
                    .setAuthor({ name: client.language[language]["Commands"]["Music"]["Playlist"]["Playlist"], iconURL: interaction.guild.iconURL() })
                    .setThumbnail(player.currentTrack.info.image)
                    .addFields(
                        { name: client.language[language]["Commands"]["Music"]["Playlist"]["FieldSong"], value: `\`\`\`${player.currentTrack.info.title}\`\`\``, inline: true },
                        { name: client.language[language]["Commands"]["Music"]["Playlist"]["FieldLength"], value: `\`\`\`${trackDuration}\`\`\``, inline: true }
                    )
                    .setColor("Green")
                    .setFooter({ text: eval(client.language[language]["Commands"]["Music"]["Playlist"]["Footer"]) });

                if (queue.length)
                    embed.addFields([
                        {
                            name: client.language[language]["Commands"]["Music"]["Playlist"]["Playlist"],
                            value: queue
                                .map((track, index) => `**${index + 1}.** ${track.info.title} - \`${formatDuration(track.info.length)}\``)
                                .join('\n'),
                        },
                    ]);
                return interaction.reply({ embeds: [embed], ephemeral: true })
            }

            if (interaction.customId === "pause") {
                if (!interaction.member.voice?.channel)
                    return interaction.reply({
                        embeds: [new Discord.EmbedBuilder()
                            .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(client.language[language]["NoUserChannel"])
                            .setColor("Red")], ephemeral: true
                    })

                if (interaction.guild.members.me.voice?.channel && interaction.member.voice?.channel.id != interaction.guild.members.me.voice?.channel.id)
                    return interaction.reply({
                        embeds: [new Discord.EmbedBuilder()
                            .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(client.language[language]["UserAndBotChannel"])
                            .setColor("Red")], ephemeral: true
                    })
                if (!player) return interaction.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                        .setDescription(client.language[language]["NoMusic"])
                        .setColor("Red")], ephemeral: true
                })

                if (player.isPaused) {
                    const stop = new Discord.ButtonBuilder().setStyle("Danger").setLabel(client.language[language]["Commands"]["Music"]["MusicButtons"]["Stop"]).setCustomId("stop")
                    const skip = new Discord.ButtonBuilder().setStyle("Primary").setLabel(client.language[language]["Commands"]["Music"]["MusicButtons"]["Skip"]).setCustomId("skip")
                    const pause = new Discord.ButtonBuilder().setStyle("Success").setLabel(client.language[language]["Commands"]["Music"]["MusicButtons"]["Pause"]).setCustomId("pause")
                    const list = new Discord.ButtonBuilder().setStyle("Secondary").setLabel(client.language[language]["Commands"]["Music"]["MusicButtons"]["Playlist"]).setCustomId("playlist")
                    const msg = interaction.message
                    await msg.edit({ embeds: [msg.embeds[0]], components: [new Discord.ActionRowBuilder().addComponents(pause, skip, stop, list)] })
                    await interaction.deferUpdate().catch(() => {
                        return;
                    })
                    player.pause(false);
                } else {
                    player.pause(true);
                    const stop = new Discord.ButtonBuilder().setStyle("Danger").setLabel(client.language[language]["Commands"]["Music"]["MusicButtons"]["Stop"]).setCustomId("stop")
                    const skip = new Discord.ButtonBuilder().setStyle("Primary").setLabel(client.language[language]["Commands"]["Music"]["MusicButtons"]["Skip"]).setCustomId("skip")
                    const pause = new Discord.ButtonBuilder().setStyle("Success").setLabel(client.language[language]["Commands"]["Music"]["MusicButtons"]["IsPause"]).setCustomId("pause")
                    const list = new Discord.ButtonBuilder().setStyle("Secondary").setLabel(client.language[language]["Commands"]["Music"]["MusicButtons"]["Playlist"]).setCustomId("playlist")
                    const msg = interaction.message
                    await msg.edit({ embeds: [msg.embeds[0]], components: [new Discord.ActionRowBuilder().addComponents(pause, skip, stop, list)] })
                    await interaction.deferUpdate().catch(() => {
                        return;
                    })
                }
            }
        }
    }
    )
}
