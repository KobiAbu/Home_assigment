const mongoose = require('mongoose')

const slideSchema = new mongoose.Schema({
    header: String,
    content: { type: String, required: true },
    photos_url: [String]
})

const schema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    Title: { type: String, unique: true, required: true },
    Authors: { type: [String], required: true },
    Date_of_Publishment: { type: Date, required: true },
    slides: { type: [slideSchema], required: true },
})

module.exports = mongoose.model('presentation', schema)