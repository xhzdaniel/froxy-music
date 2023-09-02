const Discord = require('discord.js');

module.exports = {
    CMD: new Discord.SlashCommandBuilder()
        .setDescription("Pause the playing song"),
    async execute(client, interaction, language) {
        const player = client.poru.players.get(interaction.guildId);

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
            return interaction.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setDescription(client.language[language]["Commands"]["Music"]["Pause"]["MusicPause"])
                    .setColor("Red")], ephemeral: true
            })
        } else {
            await interaction.deferReply();
            player.pause(true);
            return interaction.editReply({
                embeds: [new Discord.EmbedBuilder()
                    .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setDescription(client.language[language]["Commands"]["Music"]["Pause"]["PauseMusic"])
                    .setColor("Green")]
            })
        }
    }
};