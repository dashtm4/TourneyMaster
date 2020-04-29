import React from 'react';
import { Link } from 'react-router-dom';
import logo from 'assets/logo.png';
import './styles.css';

const Header = () => (
  <header className="header">
    <div className="header__wrapper">
      <p className="header__logo-wrapper">
        <Link to="/">
          <img src={logo} width="157" height="122" alt="Tourneymaster logo" />
        </Link>
      </p>
    </div>
  </header>
);

export default Header;
