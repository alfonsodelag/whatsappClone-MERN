import React, { useEffect, useState } from 'react';
import { useStateValue } from './StateProvider';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Login from './Login'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css'
import axios from './axios';
const Pusher = require('pusher-js');

function App() {
  const [{ user }, dispatch] = useStateValue();
  const [messages, setMessages] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    axios.get('/messages/sync')
      .then(response => {
        setMessages(response.data)
      })
  }, [])

  useEffect(() => {
    if (refresh === false) {
      axios.get('/messages/sync')
        .then(response => {
          setMessages(response.data)
        })
    }
  }, [refresh])

  useEffect(() => {
    var pusher = new Pusher('1cc8626c503135cc17ce', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted",
      (newMessage) => {
        // setMessages([...messages, newMessage])
        setRefresh(true)
        console.log("refreshing!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      });

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    };
  }, [messages]);

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
          <div className="app_body">
            <Router>
              <Switch>
                <Route path={["/rooms/:roomId", "/"]}>
                  <Sidebar />
                  <Chat messages={messages} setMessages={setMessages} />
                </Route>
              </Switch>
            </Router>
          </div>
        )}
    </div >
  );
}

export default App;
