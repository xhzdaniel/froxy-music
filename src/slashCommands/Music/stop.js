const Discord = require('discord.js')
const trackSchema = require(`${process.cwd()}/src/database/schemas/trackSchema.js`)

module.exports = {
    CMD: new Discord.SlashCommandBuilder()
        .setDescription("Stops the currently playing song or playlist"),
    async execute(client, interaction, language) {
        if (!interaction.member.voice?.channel) {
            return interaction.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setDescription(client.language[language]["NoUserChannel"])
                    .setColor("Red")], ephemeral: true
            })
        } else if (interaction.guild.members.me.voice?.channel && interaction.member.voice?.channel.id != interaction.guild.members.me.voice?.channel.id) {
            return interaction.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setDescription(client.language[language]["UserAndBotChannel"])
                    .setColor("Red")], ephemeral: true
            })
        }
        const player = client.poru.players.get(interaction.guild.id);
        if (!player) return interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(client.language[language]["NoMusic"])
                .setColor("Red")], ephemeral: true
        })



        const end = new Discord.ButtonBuilder().setStyle("Secondary").setLabel(client.language[language]["ButtonMusicEnd"]).setCustomId("end").setDisabled(true)
        const data = await trackSchema.findOne({ guildID: player.guildId })
        client.channels.cache.get(player.textChannel).messages.fetch(data.messageID).then(msg => msg.edit({ components: [new Discord.ActionRowBuilder().addComponents(end)] })).catch(() => { return; });
        await player.destroy();
        return interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(eval(client.language[language]["Commands"]["Music"]["Stop"]["ListEnd"]))
                .setColor("Green")]
        })
    }
}