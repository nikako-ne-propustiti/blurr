import React, {useCallback, useContext} from 'react';
import logo from '../logo.png';
import './Navbar.css';
import {Context} from '../shared/Context';
import {Link} from 'react-router-dom';
import {logout} from '../api';
import Icon from '../shared/Icon';

const Navbar: React.FC = () => {
    const {state, dispatch} = useContext(Context);

    const handleLogout = useCallback(async () => {
        await logout();
        dispatch({
            type : 'log-out'
        });
    }, []);

    return <nav className="navbar">
        <Link to="/" title="Home"><img src={logo} alt="Blurr" width="90" height="60" /></Link>
        <form>
            <input type="text" placeholder="Search"></input>
        </form>
        <Link to="/" title="Home"><Icon name="home" /></Link>
        {state.loggedIn && <Link to="/p/new" title="Create"><Icon name="add" /></Link>}
        {state.loggedIn && <Link to="" onClick={handleLogout} title="Logout"><Icon name="logout" /></Link>}
        {state.isAdmin && <Link to="/p/review" title="Review"><Icon name="remove_red_eye" /></Link>}
    </nav>;
}

export default Navbar;
