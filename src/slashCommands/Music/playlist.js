const Discord = require("discord.js")
const formatDuration = require(`${process.cwd()}/src/functions/convertTime/format.js`);

module.exports = {
    CMD: new Discord.SlashCommandBuilder()
        .setDescription("Get the list of songs that are in production"),
    async execute(client, interaction, language) {
        const player = client.poru.players.get(interaction.guild.id);
        if (!player)
            return interaction.reply({
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

        await interaction.deferReply();
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
        return interaction.editReply({ embeds: [embed] })
    }
}