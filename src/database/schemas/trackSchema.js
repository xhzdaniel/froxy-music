const { Schema, model } = require("mongoose")

const trackSchema = new Schema({
    guildID: String,
    messageID: String
})

module.exports = model("tracks", trackSchema)