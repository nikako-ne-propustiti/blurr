import React, {FormEvent, useCallback, useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ReactSearchAutocomplete} from 'react-search-autocomplete';
import logo from '../logo.png';
import {User} from '../models';
import {Context} from '../shared/Context';
import {Link} from 'react-router-dom';
import {logout, search} from '../api';
import Icon from '../shared/Icon';

import './Navbar.css';

const Navbar: React.FC = () => {
    const {state, dispatch} = useContext(Context);
    const [searchItems, setSearchItems] = useState<User[]>([]);
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        await logout();
        dispatch({
            type : 'log-out'
        });
    }, []);

    const handleSearch = useCallback(async (query: string) => {
        const result = await search(query);
        if (result.success) {
            setSearchItems(result.users);
        } else {
            setSearchItems([]);
        }
        console.log(searchItems);
    }, [searchItems, setSearchItems]);

    const handleSelect = useCallback((item: User) => {
        navigate(`/${item.username}`);
    }, [navigate]);

    const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }, []);

    return <div className="navbar-wrapper">
        <nav className="navbar">
            <div>
                <Link to="/" title="Home"><img src={logo} alt="Blurr" width="60" height="60" /></Link>
            </div>

            <div className="search-form-wrapper">
                <form onSubmit={handleSubmit}>
                    <ReactSearchAutocomplete
                        items={searchItems}
                        onSearch={handleSearch}
                        onSelect={handleSelect}
                        placeholder="Search"
                        resultStringKeyName="username"
                        fuseOptions={{ keys: ['username'] }}
                    />
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
