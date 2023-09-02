const Discord = require("discord.js");
const trackSchema = require(`${process.cwd()}/src/database/schemas/trackSchema.js`);
const LangSchema = require(`${process.cwd()}/src/database/schemas/language.js`);

module.exports = {
  name: "queueEnd",
  async execute(client, player) {
    const DataLang = await LangSchema.findOne({ guildID: player.guildId });
    let language = DataLang.language;
      const end = new Discord.ButtonBuilder().setStyle("Secondary").setLabel(client.language[language]["ButtonMusicEnd"]).setCustomId("end").setDisabled(true)
      const data = await trackSchema.findOne({ guildID: player.guildId })
      client.channels.cache.get(player.textChannel).messages.fetch(data.messageID).then(msg => msg.edit({ components: [new Discord.ActionRowBuilder().addComponents(end)] })).catch(() => { return; });
    setTimeout(() => {
      client.channels.cache.get(player.textChannel).send({
        embeds: [new Discord.EmbedBuilder()
          .setAuthor({ name: client.language[language]["PoruEvents"]["QueueEnd"]["TimeoutAuthor"], iconURL: client.user.displayAvatarURL() })
          .setDescription(client.language[language]["PoruEvents"]["QueueEnd"]["TimeoutDescription"])
          .setThumbnail(client.user.displayAvatarURL())
          .setColor("Green")]
      })
      return player.destroy();
    }, 60000 * 3);
  }
};