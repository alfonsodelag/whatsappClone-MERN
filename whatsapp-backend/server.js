// importing
const express = require('express')
const mongoose = require('mongoose')
const Messages = require('./dbMessages')
const Pusher = require('pusher')
const cors = require('cors')

// app config
const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: '1076274',
    key: '1cc8626c503135cc17ce',
    secret: '97099b87f462a36e6c8b',
    cluster: 'eu',
    encrypted: true
});

// middleware
app.use(express.json())

app.use(cors())

// When using cors, we don't need to set this code anymore
// app.use((req, res) => {
//     res.setHeader("Access-Control-Allow-Origin", "*")
//     res.setHeader("Access-Control-Allow-Headers", "*")
//     next()
// })

// DB config
const connection_url = 'mongodb+srv://alfonso:Panama11@webpersonal.bxdvq.mongodb.net/whatsappdb?retryWrites=true&w=majority'

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection

db.once('open', () => {
    console.log('Db Connected')

    const msgCollection = db.collection('messagecontents')
    const changeStream = msgCollection.watch()

    changeStream.on('change', (change) => {
        console.log("a change ocurred!", change);

        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted',
                {
                    name: messageDetails.name,
                    message: messageDetails.message,
                    timestamp: messageDetails.timestamp,
                    received: messageDetails.received
                });
        } else {
            console.log("Error triggering Pusher")
        }
    })
})

// api routes
app.get('/', (req, res) => res.status(200).send('Hello World'))

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
        }
    })
})

// listen
app.listen(port, () => console.log(`Listening on localhost:${port}`))
