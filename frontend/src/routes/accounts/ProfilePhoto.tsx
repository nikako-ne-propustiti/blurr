import React from 'react';
import User from '../../models/User';
import './ProfilePhoto.css';

interface Props {
    user : User,
    isMyProfile : boolean
};

// Profile photo, as it appears on the user's page
// TODO Callback for changing profile photo, should be handled by parent component
const ProfilePhoto: React.FC<Props> = ({ user, isMyProfile }) => {
    const {profilePhotoURL, username} = user;
    return <div className='profile-photo'>
        <img src={profilePhotoURL} title={username} />
    </div>
};

export default ProfilePhoto;