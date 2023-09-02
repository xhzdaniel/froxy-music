const { Schema, model } = require("mongoose")

const premium = new Schema({
   ID: String,
   time: String
})

module.exports = model("premium", premium)