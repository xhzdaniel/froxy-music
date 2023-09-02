const Discord = require("discord.js")
const LangSchema = require(`${process.cwd()}/src/database/schemas/language.js`)

module.exports = {
    CMD: new Discord.SlashCommandBuilder()
        .setDescription("Change the language of the bot")
        .addStringOption(option =>
            option.setName("language")
                .setDescription("Language to use in the bot")
                .addChoices(
                    { name: "Spanish", value: "es" },
                    { name: "English", value: "en" },
                )
                .setRequired(true))
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator),
    async execute(client, interaction, language) {
        const Lang = interaction.options.getString("language");
        await interaction.deferReply({ ephemeral: true });
        let data = await LangSchema.findOne({ guildID: interaction.guild.id });
        data.language = Lang;
        data.save();
        return interaction.editReply({
            embeds: [new Discord.EmbedBuilder()
                .setAuthor({ name: client.language[Lang]["Commands"]["Language"]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(client.language[Lang]["Commands"]["Language"]["EmbedDescription"] + Lang.replace("es", "**Español**").replace("en", "**English**"))
                .setColor("Green")], ephemeral: true
        })
    }
}