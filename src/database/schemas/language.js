const { Schema, model } = require("mongoose")

const language = new Schema({
    guildID: String,
    language: { type: String, default: "en" }
})

module.exports = model("language", language)