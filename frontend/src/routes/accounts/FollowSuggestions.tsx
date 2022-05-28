import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../models';
import './FollowSuggestions.css';

interface Props {
    users: User[]
};

const FollowSuggestions: React.FC<Props> = ({ users }) => {
    return <div className="follow-suggestions">
        {users.map(({ username, profilePhotoURL, id }) => {
            return <div className='follow-suggestion' key={id}>
                <Link to={username}>
                    <img src={profilePhotoURL}></img>
                </Link>
                <Link to={username}>
                    {username}
                </Link>
            </div>
        })}
    </div>
}

export default FollowSuggestions;
