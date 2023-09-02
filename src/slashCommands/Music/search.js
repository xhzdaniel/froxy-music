const Discord = require('discord.js')
const formatDuration = require(`${process.cwd()}/src/functions/convertTime/format.js`);

module.exports = {
    CMD: new Discord.SlashCommandBuilder()
        .setDescription("Find your favorite song")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("Please provide the name of the song you want to search for")
                .setRequired(true)),
    async execute(client, interaction, language) {
        const cancion = interaction.options.getString("name");

        let player = client.poru.players.get(interaction.guild.id);

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
        if (/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(cancion)) {
            return interaction.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setDescription(eval(client.language[language]["Commands"]["Music"]["Search"]["NoLink"]))
                    .setColor("Red")], ephemeral: true
            })
        }

        await interaction.deferReply();

        if (!player) {
            player = await client.poru.createConnection({
                guildId: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
                deaf: true,
            });
        }

        const res = await client.poru.resolve(cancion, "spotify");
        const { tracks } = res;

        const results = tracks.slice(0, 10);

        let n = 0;

        const str = tracks
            .slice(0, 10)
            .map(
                (r) =>
                    `\`${++n}.\` **[${r.info.title.length > 20 ? r.info.title.substr(0, 25) + "..." : r.info.title}](${r.info.uri})** ${language.replace("es", "de").replace("en", "of")} ${r.info.author} - \`${r.info.isStream ? "LIVE" : formatDuration(r.info.length)}\``,
            )
            .join("\n");

        const selectMenuArray = [];

        for (let i = 0; i < results.length; i++) {
            const track = results[i];

            let label = `${i + 1}. ${track.info.title}`;
            let dc = `${track.info.author}`;
            if (label.length > 50) label = label.substring(0, 47) + "...";
            if (dc.length > 50) dc = dc.substring(0, 47) + "...";


            selectMenuArray.push({
                label: label,
                description: dc,
                value: i.toString(),
            });
        }

        const selection = new Discord.ActionRowBuilder().addComponents([
            new Discord.StringSelectMenuBuilder()
                .setCustomId("search")
                .setPlaceholder(client.language[language]["Commands"]["Music"]["Search"]["SelectSong"])
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(selectMenuArray),
        ]);

        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: client.language[language]["Commands"]["Music"]["Search"]["SongList"], iconURL: interaction.user.displayAvatarURL() })
            .setDescription(str)
            .setColor("Green")
            .setThumbnail(interaction.user.displayAvatarURL())

        await interaction.editReply({ embeds: [embed], components: [selection] }).then((message) => {
            let count = 0;

            const selectMenuCollector = message.createMessageComponentCollector({
                time: 86400000,
            });

            const toAdd = [];

            try {
                selectMenuCollector.on("collect", async (menu) => {
                    if (menu.user.id !== interaction.member.id) {
                        return interaction.reply({
                            embeds: [new Discord.EmbedBuilder()
                                .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                                .setDescription(client.language[language]["Commands"]["Music"]["Search"]["NoMenu"])
                                .setColor("Red")], ephemeral: true
                        })
                    }

                    let player = client.poru.players.get(interaction.guild.id);
                    if (!player) {
                        player = await client.poru.createConnection({
                            guildId: interaction.guild.id,
                            voiceChannel: interaction.member.voice.channel.id,
                            textChannel: interaction.channel.id,
                            deaf: true,
                        });
                    }

                    await menu.deferUpdate();

                    for (const value of menu.values) {
                        toAdd.push(tracks[value]);
                        count++;
                    }

                    for (const track of toAdd) {
                        track.info.requester = interaction.user;
                        player.queue.add(track);
                    }

                    const track = toAdd.shift();
                    const trackTitle = track.info.title.length > 15 ? track.info.title.substr(0, 15) + "..." : track.info.title;

                    const tplay = new Discord.EmbedBuilder()
                        .setAuthor({ name: eval(client.language[language]["Commands"]["Music"]["Search"]["SongBy"]), iconURL: interaction.user.displayAvatarURL() })
                        .setColor("Green")
                        .setDescription(`> **[${trackTitle ? trackTitle : "Unknown"}](${track.info.uri})** ${language.replace("es", "de").replace("en", "of")} \`${(track.info.author)}\` - \`${track.info.isStream ? "LIVE" : formatDuration(track.info.length)}\``,
                        );

                    await interaction.channel.send({ embeds: [tplay] });
                    if (!player.isPlaying && !player.isPaused) return player.play();
                });

                selectMenuCollector.on("end", async (collected, reason) => {
                    if (reason === "time") {
                        const timed = new Discord.EmbedBuilder()
                            .setAuthor({ name: client.language[language]["EmbedAuthor"] + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(client.language[language]["Commands"]["Music"]["Search"]["CollectEnd"])
                            .setColor("Red")

                        await message.edit({ embeds: [timed], components: [] });
                    }
                });
            } catch (e) {
                console.log(e);
            }
        });
    }

}