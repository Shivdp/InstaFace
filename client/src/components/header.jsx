import React from 'react';
//import Authorization from '../containers/authorization';

const Header = (props) => (
  <div className="header">
    <div className="container">
      <img 
        src="./assets/images/instaface-logo-new.png"
        alt="instagace-logo"
        className="logo"
        onClick={props.refreshFeed}
      />
      {/* <Authorization /> */}
    </div>
  </div>
);

export default Header;