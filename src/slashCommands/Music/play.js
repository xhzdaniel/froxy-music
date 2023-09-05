const Discord = require('discord.js');
const formatDuration = require(`${process.cwd()}/src/functions/convertTime/format.js`);

module.exports = {
  CMD: new Discord.SlashCommandBuilder()
    .setDescription("Play a song on a voice channel")
    .addStringOption(option =>
      option.setName("song")
        .setDescription("Song to play on the voice channel")
        .setRequired(true)),
  async execute(client, interaction, language) {
    const cancion = interaction.options.getString("song");
    if (!interaction.member.voice?.channel)
      return interaction.reply({
        embeds: [new Discord.EmbedBuilder()
          .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
          .setDescription(client.language[language]["NoUserChannel"])
          .setColor("Red")], ephemeral: true
      });

    if (interaction.guild.members.me.voice?.channel && interaction.member.voice?.channel.id != interaction.guild.members.me.voice?.channel.id)
      return interaction.reply({
        embeds: [new Discord.EmbedBuilder()
          .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
          .setDescription(client.language[language]["UserAndBotChannel"])
          .setColor("Red")], ephemeral: true
      });

    if (/(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(cancion)) {
      return interaction.reply({
        embeds: [new Discord.EmbedBuilder()
          .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
          .setDescription(client.language[language]["Commands"]["Music"]["Play"]["NoYoutube"])
          .setColor("Red")], ephemeral: true
      });
    }

    const player = client.poru.createConnection({
      guildId: interaction.guildId,
      voiceChannel: interaction.member.voice.channelId,
      textChannel: interaction.channel.id,
      deaf: true,
    });

    let resolve = await client.poru.resolve(cancion, 'spotify');
    if (!resolve) return await client.poru.resolve(cancion, 'scsearch');
    const { loadType, tracks, playlistInfo } = resolve;
    if (loadType === 'PLAYLIST_LOADED') {
      for (const track of resolve.tracks) {
        track.info.requester = interaction.user;
        player.queue.add(track);
      }
      interaction.reply({
        embeds: [new Discord.EmbedBuilder()
          .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
          .setDescription(eval(client.language[language]["Commands"]["Music"]["Play"]["AddPlaylist"]))
          .setColor("Green")]
      })
      if (!player.isPlaying && !player.isPaused) return player.play();

    } else if (loadType === 'SEARCH_RESULT' || loadType === 'TRACK_LOADED') {
      const track = tracks.shift();
      track.info.requester = interaction.user;
      player.queue.add(track);
      const trackDuration = track.info.isStream ? "LIVE" : formatDuration(track.info.length);
      interaction.reply({
        embeds: [new Discord.EmbedBuilder()
          .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
          .setDescription(eval(client.language[language]["Commands"]["Music"]["Play"]["AddSong"]))
          .setColor("Green")]
      });

      if (!player.isPlaying && !player.isPaused) return player.play();
    } else {
      player.destroy();
      return interaction.reply({
        embeds: [new Discord.EmbedBuilder()
          .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
          .setDescription(client.language[language]["MusicError"])
          .setColor("Red")], ephemeral: true
      })
    }
  }
};