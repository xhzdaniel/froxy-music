const Discord = require('discord.js')
const LangSchema = require(`${process.cwd()}/src/database/schemas/language.js`)

module.exports = { saveGuild };

async function saveGuild (guildId) {
    if(guildId){
        let dataServer = await LangSchema.findOne({ guildID: guildId });
        if(!dataServer){
            console.log(`[+] Se ha guardado un nuevo servidor`.green);
            dataServer = await new LangSchema({guildID: guildId});
            await dataServer.save();
        }
    }
}