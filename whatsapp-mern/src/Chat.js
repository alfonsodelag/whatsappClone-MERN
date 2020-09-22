import React, { useState, useEffect, useContext } from 'react'
import { Avatar, IconButton } from "@material-ui/core"
import { useParams } from 'react-router-dom'
import { StateContext } from './StateProvider'
import { AttachFile, MoreVert, SearchOutlined } from '@material-ui/icons'
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import MicIcon from "@material-ui/icons/Mic"
import axios from "./axios"
import moment from 'moment'
import db from "./firebase"


import "./Chat.css"

function Chat({ messages }) {
    console.log("messages", messages)
    const [input, setInput] = useState("")
    console.log("input", input)
    const [seed, setSeed] = useState("")
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("")
    const state = useContext(StateContext);
    console.log("user", state[0].user.displayName);

    useEffect(() => {
        if (roomId) {
            console.log("roomId", roomId)
            db.collection('rooms')
                .doc(roomId)
                .onSnapshot(snapshot => (
                    setRoomName(snapshot.data().name)
                ))

            // db.collection("rooms")
            // .doc(roomId)
            // .collection("messages").orderBy('timestamp', 'asc')
            // .onSnapshot(snapshot => (
            //         setMessages(snapshot.docs.map((doc) => doc.data()))
            //     ))
        }
    }, [roomId])

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, [])

    const sendMessage = async (e) => {
        e.preventDefault();

        console.log("roomName", roomName)
        await axios.post('/messages/new', {
            message: input,
            name: state[0].user.displayName,
            timestamp: `${new Date().toUTCString()}`,
            roomName
        });
        setInput('');
    }

    return (
        <div className="chat">
            {/* Chat Header */}
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />

                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>last seen</p>
                    {/* {new Date(messages[messages.length - 1]?.timestamp?.toDate()).toUTCString()} */}
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>

            {/* Chat body */}
            <div className="chat__body">
                {messages.map((message) => {
                    if (message.roomName === roomName) {
                        return (
                            <p className={`chat__message ${message.received && "chat__receiver"}`}>
                                <span className="chat__name">{message.name}</span>
                                {message.message}
                                <span className="chat__timestamp">
                                    {moment().format(`MMMM Do YYYY, h:mm:ss a`)}
                                </span>
                            </p>
                        )
                    }
                }
                )}
            </div>

            {/* Chat footer */}
            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type a message"
                        type="text"
                    />
                    <button onClick={sendMessage} type="submit">
                        Send a Message
                    </button>
                </form>
                <MicIcon />
            </div>
        </div>
    )
}

export default Chat
