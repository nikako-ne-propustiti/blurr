import React from 'react';
import add from '../add.png';
import home from '../home.png';
import logo from '../logo.png';
import './Navbar.css';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <img src={logo} alt="Blurr" width="90" height="60" />
            <form>
                <input type="text" placeholder="Search"></input>
            </form>
            <a href="/" title="Home"><img src={home} width="36" height="36" alt="Home" /></a>
            <a href="#" title="Create"><img src={add} width="36" height="36" alt="Create" /></a>
        </nav>
    );
}

export default Navbar;
