const functions = require('firebase-functions')
const express = require('express')
const mongoose = require('mongoose')
const Messages = require('./dbMessages')
const Pusher = require('pusher')
const cors = require('cors')

const pusher = new Pusher({
    appId: '1076274',
    key: '1cc8626c503135cc17ce',
    secret: '97099b87f462a36e6c8b',
    cluster: 'eu',
    encrypted: true
});

// DB config
const connection_url = 'mongodb+srv://alfonso:Panama11@webpersonal.bxdvq.mongodb.net/whatsappdb?retryWrites=true&w=majority'

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const app = express();

app.use(express.json())

app.use(cors())

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body
    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
            console.log("data", data)
            pusher.trigger('messages', 'inserted',
                {
                    name: data.name,
                    message: data.message,
                    timestamp: data.timestamp,
                    received: data.received
                });
        }
    })
})

exports.app = functions.https.onRequest(app);