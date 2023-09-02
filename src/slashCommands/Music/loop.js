const Discord = require("discord.js")

module.exports = {
    CMD: new Discord.SlashCommandBuilder()
        .setDescription("Activate the loop mode to the song or playlist"),
    current: true,
    async execute(client, interaction, language) {

        const player = client.poru.players.get(interaction.guild.id);
        if (!player) return interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(client.language[language]["NoMusic"])
                .setColor("Red")], ephemeral: true
        })

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

        await interaction.deferReply();
        if (player.loop === 'NONE') {
            player.setLoop('TRACK');
            return interaction.editReply({
                embeds: [new Discord.EmbedBuilder()
                    .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setDescription(client.language[language]["Commmands"]["Music"]["Loop"]["BucleToMusic"])
                    .setColor("Green")]
            })
        } else if (player.loop === 'TRACK') {
            player.setLoop('QUEUE');
            return interaction.editReply({
                embeds: [new Discord.EmbedBuilder()
                    .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setDescription(client.language[language]["Commmands"]["Music"]["Loop"]["BucleToPlaylist"])
                    .setColor("Green")]
            })
        } else if (player.loop === 'QUEUE') {
            player.setLoop('NONE');
            return interaction.editReply({
                embeds: [new Discord.EmbedBuilder()
                    .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setDescription(client.language[language]["Commmands"]["Music"]["Loop"]["BucleNone"])
                    .setColor("Red")]
            })
        }
    }
}