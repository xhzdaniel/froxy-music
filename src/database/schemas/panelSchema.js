const { Schema, model } = require("mongoose")

const panelSchema = new Schema({
    guildID: String,
    channelID: String,
    messageID: String
})

module.exports = model("paneles", panelSchema)