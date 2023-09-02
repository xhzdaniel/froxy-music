const Discord = require('discord.js');
const { getAudioUrl } = require('google-tts-api');
const {
    createAudioResource,
    createAudioPlayer,
    joinVoiceChannel,
    getVoiceConnection,
} = require('@discordjs/voice');

module.exports = {
    CMD: new Discord.SlashCommandBuilder()
        .setDescription("Play text on the voice channel")
        .addStringOption(option =>
            option.setName("text")
                .setDescription("Text to play on the voice channel")
                .setRequired(true)),
    BOT_PERMISSIONS: ["Connect", "Speak"],
    async execute(client, interaction, language) {
        const text = interaction.options.getString("text")
        if (text.length >= 150) return interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(client.language[language]["Commands"]["VoiceSay"]["MaxLength"])
                .setColor("Red")], ephemeral: true
        })
        const audioUrl = getAudioUrl(`${interaction.user.username} ${language.replace("es", "dice").replace("en", "say")} ${text}`, {
            lang: language.replace("es", "es-CO").replace("en", "en-US"),
        });
        const PoruPlayer = client.poru.players.get(interaction.guildId);
        const channel = interaction.member.voice?.channel;
        if (!channel)
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
        if (PoruPlayer) return interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(client.language[language]["Commands"]["VoiceySay"]["NowPlaying"])
                .setColor("Red")], ephemeral: true
        })
        await interaction.deferReply();
        let connection = getVoiceConnection(interaction.guildId);
        if (!connection) {
            connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guildId,
                adapterCreator: channel.guild.voiceAdapterCreator
            });
        }
        const resource = createAudioResource(audioUrl);
        const player = createAudioPlayer();
        player.play(resource);
        connection.subscribe(player);
        await interaction.editReply({
            embeds: [new Discord.EmbedBuilder()
                .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(client.language[language]["Commands"]["VoiceSay"]["SayText"])
                .setColor("Green")], ephemeral: true
        })
        player.on("idle", () => {
            player.stop();
            setTimeout(() => {
                connection.destroy();
            }, 30000);
        })
    }
}