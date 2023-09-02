const Discord = require('discord.js');

module.exports = {
    CMD: new Discord.SlashCommandBuilder()
        .setDescription("Salta a la siguiente canción"),
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
        player.stop();
        return interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(eval(client.language[language]["Commands"]["Music"]["Skip"]["Skip"]))
                .setColor("Green")]
        })
    }
};