import React from 'react';
import {BACKEND_API_URL, profilePhoto} from '../api';
import {User} from '../models';
import {Context} from './Context';

import './ProfilePhoto.css';

interface Props {
    userInfo: User,
    setUserInfo: (userInfo: User) => void
}

// Profile photo, as it appears on the user's page
const ProfilePhoto: React.FC<Props> = ({userInfo, setUserInfo}) => {
    const {state: context} = React.useContext(Context);
    const clickable = userInfo.username === context.currentUser;
    const fileInput = React.useRef<HTMLInputElement>(null);

    const uploadFile = React.useCallback(async () => {
        if (!fileInput.current || !userInfo) {
            return;
        }
        const file = fileInput.current.files?.item(0);
        if (!file) {
            return;
        }
        if (!file.type.includes('image/jpeg')) {
            alert('File must be JPEG.');
            return;
        }
        if (file.size > 2048 * 1024) {
            alert('Maximum 2 MB for profile photo.');
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        const response = await profilePhoto(formData);
        if (response.success) {
            setUserInfo({
                ...userInfo,
                profilePhotoURL: response.url
            });
        } else {
            alert(response.error);
        }
        fileInput.current.value = '';
    }, [fileInput, userInfo, setUserInfo]);

    const openFileDialog = React.useCallback(() => {
        // Simulate click on input field
        fileInput.current?.click();
    }, []);

    return <div className={`profile-photo ${clickable ? 'profile-photo-clickable' : ''}`}>
        <img src={`${BACKEND_API_URL}/${userInfo.profilePhotoURL}`} title={userInfo.username} onClick={openFileDialog} />
        {clickable && <input type="file" accept=".jpg, .jpeg" onChange={uploadFile} ref={fileInput} id="profilePhotoFile" />}
    </div>
};

export default ProfilePhoto;
