import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = props => {
  const [name, setName] = useState('');

  const handleErrors = event => {
    event.preventDefault();
    const usernameBox = document.querySelector('.input');
    const errors = document.querySelector('.errors');
    if (!usernameBox.value) {
      errors.textContent = 'Username can not be empty';
    } else if (props.location.state.error) {
      console.log('hello');
      errors.textContent = props.location.state.error;
    }
  };

  const handleKeyPress = () => {
    const usernameBox = document.querySelector('.input');
    const errors = document.querySelector('.errors');
    if (!usernameBox.value) {
      errors.textContent = 'Username can not be empty';
    } else {
      const { href } = window.location;
      window.location.href = `${href}chat?name=${name}`;
    }
  };

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
              event.key === 'Enter' ? handleKeyPress() : null
            }
          />
        </div>
        <div className='errors'>
          {/* {props.location.state.error ? props.location.state.error : ''} */}
        </div>

        <Link
          onClick={event => (!name ? handleErrors(event) : null)}
          to={`/chat?name=${name}`}>
          <button className='button mt-20' type='submit'>
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
