import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import './Login.css';

const Login = props => {
  const [name, setName] = useState('');
  const [redirect, setRedirect] = useState(false);

  let usernameBox;
  let errors;

  useEffect(() => {
    if (props.location.state) {
      errors = document.querySelector('.errors');
      errors.textContent = props.location.state.error;
    }
  }, []);

  const redirectToChat = () => {
    const chatURL = `/chat?name=${name}`;
    return <Redirect to={chatURL} />;
  };

  const handleErrors = event => {
    event.preventDefault();
    usernameBox = document.querySelector('.input');
    errors = document.querySelector('.errors');
    if (!usernameBox.value) {
      errors.textContent = 'Username can not be empty';
    } else {
      setRedirect(true);
    }
  };
  if (redirect) return redirectToChat();

  return (
    <div className='outerWrapper'>
      <div className='innerWrapper animated fadeInDown'>
        <h1 className='heading'>Enter Nickname and login!</h1>
        <div>
          <input
            className='input'
            type='text'
            onChange={event => setName(event.target.value)}
            onKeyPress={event =>
              event.key === 'Enter' ? handleErrors(event) : null
            }
          />
        </div>
        <div className='errors'></div>

        <button className='button mt-20' type='submit' onClick={handleErrors}>
          Log In
        </button>
      </div>
    </div>
  );
};

export default Login;
