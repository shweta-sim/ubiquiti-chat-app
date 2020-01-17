import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';
import Header from '../Header/Header';
import Messages from '../Messages/Messages';
import InputBox from '../InputBox/InputBox';
import { Redirect } from 'react-router-dom';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const errorTaken = 'Nickname already taken.';

  const ENDPOINT = 'localhost:5000';

  const redirectToLogin = () => {
    console.log('exists, redirecting from chat');
    return (
      <Redirect
        to={{
          pathname: '/',
          state: { error: errorTaken }
        }}
      />
    );
  };

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit('login', { name, room }, error => {
      console.log(error);
      if (error) {
        setRedirect(true);
      }
    });

    // console.log(socket);

    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', message => {
      setMessages([...messages, message]);
    });

    socket.on('connect_timeout', timeout => {
      console.log('timed out in', timeout);
    });
  }, [messages]);

  const sendMessage = event => {
    event.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  if (redirect) return redirectToLogin();
  return (
    <div className='wrapper'>
      <div className='container animated fadeInDown'>
        <Header user={name} />
        <Messages messages={messages} name={name} />
        <InputBox
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
