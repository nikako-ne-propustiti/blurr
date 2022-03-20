import React from 'react';
import { Link } from 'react-router-dom';
import User from '../../models/User';
import './ProfilePhoto.css';

interface Props {
    user: User,
    isMyProfile: boolean
};

// Profile photo, as it appears on the user's page
// TODO Refactor uploading profile photo as callback to parent component
const ProfilePhoto: React.FC<Props> = ({ user, isMyProfile, }) => {
    // TODO Refactor
    let className = 'profile-photo';
    if (isMyProfile) className += ' profile-photo-clickable';

    const fileInput = React.useRef<HTMLInputElement>(null);

    // TODO This will also have to be written a bit nicer
    const uploadFile = () => {
        if (!fileInput.current) return;

        // What file we got
        const file = fileInput.current.files?.item(0);
        if (!file) {
            alert("No file selected.");
            return;
        }

        if (!file.type.includes('image/jpeg')) {
            alert("File must be JPEG.");
            return;
        }

        if (file.size > 2048*1024) {
            alert("Maximum 2 MB for profile photo.");
            return;
        }

        alert("Simulated file upload");

        // The server would inform us about the file being inadequate in any other way
        // E.g. resolution, etc.
    };

    const openFileDialog = () => {
        if (!isMyProfile) return;
        if (!fileInput.current) return;

        // Simulate click on input field
        fileInput.current.click();
    }

    const { profilePhotoURL, username } = user;

    return <div className={className}>
        <img src={profilePhotoURL} title={username} onClick={openFileDialog} />
        {isMyProfile && <input type="file" accept=".jpg, .jpeg" onChange={uploadFile} ref={fileInput} id="profilePhotoFile" />}
    </div>
};

export default ProfilePhoto;