const mongoose = require('mongoose')

const whatsappSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    roomName: String,
    received: Boolean
});

// const rooms = mongoose.Schema({
//     messages: [whatsappSchema],
//     roomName: String
// });

module.exports = mongoose.model("messagecontents", whatsappSchema)

