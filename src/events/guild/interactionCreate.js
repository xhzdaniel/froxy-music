const Discord = require("discord.js")
const premiumSchema = require(`${process.cwd()}/src/database/schemas/premium.js`)
const LangSchema = require(`${process.cwd()}/src/database/schemas/language.js`)
const { saveGuild } = require(`${process.cwd()}/src/functions/saveGuild/saveGuild.js`)

module.exports = async (client, interaction) => {
    if (!interaction.guild || !interaction.channel) return;
    const COMANDO = client.slashCommands.get(interaction?.commandName);
    await saveGuild(interaction.guild.id);
    const DataLang = await LangSchema.findOne({ guildID: interaction.guild.id });
    let language = DataLang.language;
    if (COMANDO) {
        if (COMANDO.OWNER) {
            if (!process.env.OWNER_IDS.split(" ").includes(interaction.user.id))
                return interaction.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setAuthor({ name: client.language[language]["Events"]["InteractionCreate"]["DevAuthor"], iconURL: client.user.displayAvatarURL() })
                        .setDescription(client.language[language]["Events"]["InteractionCreate"]["DevDescription"])
                        .setColor("Red")], ephemeral: true
                })
        }

        if (COMANDO.PREMIUM) {
            const dataServer = await premiumSchema.findOne({ ID: interaction.guild.id })
            if (dataServer) {
                if (dataServer.time <= Date.now()) return interaction.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                        .setDescription(client.language[language]["Events"]["InteractionCreate"]["PremiumExpired"])
                        .setColor("Red")], ephemeral: true
                })
            } else {
                return interaction.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: client.user.displayAvatarURL() })
                        .setDescription(client.language[language]["Events"]["InteractionCreate"]["PremiumNone"])
                        .setColor("Red")], ephemeral: true
                })
            }
        }

        if (COMANDO.BOT_PERMISSIONS) {
            if (!interaction.guild.members.me.permissions.has(COMANDO.BOT_PERMISSIONS))
                return interaction.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setAuthor({ name: client.language[language]["Events"]["InteractionCreate"]["NoPermissionsAuthor"], iconURL: client.user.displayAvatarURL() })
                        .setDescription(`> ${client.language[language]["Events"]["InteractionCreate"]["NoPermissionsBotDescription"]} ${COMANDO.BOT_PERMISSIONS.map(PERMISO => `\`${PERMISO}\``).join(", ")}`)
                        .setColor("Red")], ephemeral: true
                })
        }

        if (COMANDO.PERMISSIONS) {
            if (!interaction.member.permissions.has(COMANDO.PERMISSIONS)) {
                return interaction.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setAuthor({ name: client.language[language]["Events"]["InteractionCreate"]["NoPermissionsAuthor"], iconURL: interaction.user.displayAvatarURL() })
                        .setDescription(`> ${client.language[language]["Events"]["InteractionCreate"]["NoPermissionsUserDescription"]} ${COMANDO.PERMISSIONS.map(PERMISO => `\`${PERMISO}\``).join(", ")}`)
                        .setColor("Red")], ephemeral: true
                })
            }
        }

        COMANDO.execute(client, interaction, DataLang.language);
    }
}

