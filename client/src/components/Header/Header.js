import React from 'react';
import closeIcon from '../../icons/closeIcon.png';
import onlineIcon from '../../icons/onlineIcon.png';
import './Header.css';

const Header = () => {
  return (
    <div className='header'>
      <div className='leftWrapper'>
        <img className='icon-online' src={onlineIcon} alt='online' />
        <h3>Ubiquity Chat</h3>
      </div>
      <div className='rightWrapper'>
        <a href='/'>
          <img src={closeIcon} alt='close' />
        </a>
      </div>
    </div>
  );
};

export default Header;
