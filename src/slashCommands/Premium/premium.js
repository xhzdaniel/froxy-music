const Discord = require("discord.js")
const premiumSchema = require(`${process.cwd()}/src/database/schemas/premium.js`)
const ms = require('ms')

module.exports = {
    CMD: new Discord.SlashCommandBuilder()
        .setDescription("Este comando es solo para desarrolladores del bot")
        .addSubcommand(option =>
            option.setName("añadir")
                .setDescription("Añade un usuario al sistema premium")
                .addStringOption(option =>
                    option.setName("id")
                        .setDescription("ID al que le añadirás la suscripción premium")
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("duración")
                        .setDescription("Duración que tendrá la suscripción premium")
                        .setRequired(true)))
        .addSubcommand(option =>
            option.setName("eliminar")
                .setDescription("Elimina a un usuario del sistema premium")
                .addStringOption(option =>
                    option.setName("id")
                        .setDescription("ID al que le eliminarás la suscripción premium")
                        .setRequired(true))),
    OWNER: true,
    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: true })
        switch (interaction.options.getSubcommand()) {
            case "añadir": {
                const ID = interaction.options.getString("id");
                const tiempo = interaction.options.getString("duración");
                const duracion = ms(tiempo)
                await premiumSchema.findOneAndUpdate({ ID: ID }, { time: Math.round(Date.now() + Number(duracion)) }, { new: true, upsert: true })

                await interaction.editReply({
                    embeds: [new Discord.EmbedBuilder()
                        .setAuthor({ name: `Hola ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                        .setDescription(`> El ID indicado fue añadido a la lista premium`)
                        .setColor("Green")]
                })
            }
                break;
            case "eliminar": {
                const ID = interaction.options.getString("id")
                const data = await premiumSchema.findOne({ ID: ID })
                if (!data) {
                    await interaction.editReply({
                        embeds: [new Discord.EmbedBuilder()
                            .setAuthor({ name: `Hola ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(`> El servidor no tiene una suscripción premium`)
                            .setColor("Red")]
                    })
                } else {
                    await premiumSchema.findOneAndDelete({ ID: ID })

                    await interaction.editReply({
                        embeds: [new Discord.EmbedBuilder()
                            .setAuthor({ name: `Hola ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(`> El ID indicado fue eliminado de la lista premium`)
                            .setColor("Green")]
                    })
                }
            }
        }
    }
}