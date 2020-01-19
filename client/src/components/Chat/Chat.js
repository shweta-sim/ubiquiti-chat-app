import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import io from 'socket.io-client';
import Header from '../Header/Header';
import Messages from '../Messages/Messages';
import InputBox from '../InputBox/InputBox';
import './Chat.css';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [redirect, setRedirect] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const ENDPOINT = 'localhost:5000';

  const redirectToLogin = () => {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: { error: redirect }
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
      error ? setRedirect('Nickname is already taken') : setLoggedIn(true);
    });

    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', message => {
      setMessages([...messages, message]);
    });

    socket.on('connect_error', error => {
      if (error) setRedirect('Server is unavailable');
    });
  }, [messages]);

  const sendMessage = event => {
    event.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  if (redirect !== '') return redirectToLogin();

  return (
    <div className='wrapper'>
      {loggedIn ? (
        <div className='container animated fadeInDown'>
          <Header user={name} />
          <Messages messages={messages} name={name} />
          <InputBox
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Chat;
