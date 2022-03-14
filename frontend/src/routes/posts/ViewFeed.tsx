import React, {useContext} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {Context} from '../../shared/Context';

const ViewFeed: React.FC = () => {
    const {state} = useContext(Context);
    return (
        <div>
            {state.loggedIn || <Navigate to="/accounts/login" />}
            <Link to='/lol'>Lol</Link>
        </div>
    );
}

export default ViewFeed;
