import React from 'react';
import './InputBox.css';

const InputBox = ({ setMessage, sendMessage, message }) => (
  <form className='form'>
    <input
      className='inputBox'
      type='text'
      placeholder='Type a message...'
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={event => (event.key === 'Enter' ? sendMessage(event) : null)}
    />
    <button className='button-send' onClick={event => sendMessage(event)}>
      Send
    </button>
  </form>
);

export default InputBox;
