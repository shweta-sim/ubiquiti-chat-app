import React from 'react';
import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { user, text }, name }) => {
  let isSentByCurrentUser = false;
  let isSentByAdmin = false;

  const trimmedName = name.trim();
  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }
  if (user === 'admin') {
    isSentByAdmin = true;
  }

  return isSentByCurrentUser ? (
    <div className='messagecontainer justifyEnd'>
      <div className='messageBox backgroundBlue'>
        <p className='messageText colorWhite'>{ReactEmoji.emojify(text)}</p>
      </div>
    </div>
  ) : isSentByAdmin ? (
    <div className='messagecontainer justifyStart'>
      <div className=''>
        <p className='messageTextAdmin colorWhite'>Admin: {text}</p>
      </div>
    </div>
  ) : (
    <div className='messagecontainer justifyStart'>
      <div className='messageBox backgroundLight'>
        <p className='messageText colorDark'>{text}</p>
      </div>
      <p className='sentText pl-10'>{user}</p>
    </div>
  );
};
export default Message;
