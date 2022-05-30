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

    return <div className="navbar-wrapper">
        <nav className="navbar">
            <div>
                <Link to="/" title="Home"><img src={logo} alt="Blurr" width="60" height="60" /></Link>
            </div>

            <div>
                <form>
                    <input spellCheck="false" type="text" placeholder="Search"></input>
                </form>
            </div>

            <div className="navbar-right">
                <Link to="/" title="Home"><Icon name="home" /></Link>
                {state.loggedIn && state.currentUser && <Link to={state.currentUser} title="Profile"><Icon name="account_box" /></Link>}
                {state.loggedIn && <Link to="/p/new" title="Create"><Icon name="add_box" /></Link>}
                {state.isAdmin && <Link to="/p/review" title="Review"><Icon name="remove_red_eye" /></Link>}
                {state.loggedIn && <Link to="" onClick={handleLogout} title="Logout"><Icon name="logout" /></Link>}
            </div>
        </nav>
    </div>;
}

export default Navbar;
