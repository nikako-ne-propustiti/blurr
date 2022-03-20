import React, {useContext} from 'react';
import add from '../add.png';
import home from '../home.png';
import logo from '../logo.png';
import './Navbar.css';
import {Context} from '../shared/Context';
import {Link} from 'react-router-dom';

const Navbar: React.FC = () => {
    const {state} = useContext(Context);
    return <nav className="navbar">
        <Link to="/" title="Home"><img src={logo} alt="Blurr" width="90" height="60" /></Link>
        <form>
            <input type="text" placeholder="Search"></input>
        </form>
        <Link to="/" title="Home"><img src={home} width="36" height="36" alt="Home" /></Link>
        {state.loggedIn && <Link to="/p/new" title="Create"><img src={add} width="36" height="36" alt="Create" /></Link>}
    </nav>;
}

export default Navbar;
