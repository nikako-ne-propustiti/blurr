import React from 'react';
import './ProfilePhoto.css'

interface Props {
    username?: string,
    profilePhotoURL?: string,
    canChange?: boolean
};

// Profile photo, as it appears on the user's page
// TODO Callback for changing profile photo, should be handled by parent component
const ProfilePhoto: React.FC<Props> = ({ username, profilePhotoURL, canChange }) => {
    return <div className='profile-photo'>
        <img src={profilePhotoURL} title={username} />
    </div>
};

export default ProfilePhoto;