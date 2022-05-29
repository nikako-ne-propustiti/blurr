import React from 'react';

import './ProfilePhoto.css';
import {BACKEND_API_URL} from "../../api";

interface Props {
    profilePhotoURL: string,
    callback?: (file?: File | null) => void
    tooltip?: string
}

// Profile photo, as it appears on the user's page
const ProfilePhoto: React.FC<Props> = ({profilePhotoURL, callback, tooltip}) => {
    let className = 'profile-photo';
    if (callback != null) className += ' profile-photo-clickable';

    const fileInput = React.useRef<HTMLInputElement>(null);

    const uploadFile = React.useCallback(() => {
        if (!fileInput.current || !callback) {
            return;
        }
        callback(fileInput.current.files?.item(0));
        fileInput.current.value = '';
    }, [fileInput]);

    const openFileDialog = React.useCallback(() => {
        if (!fileInput.current) return;

        // Simulate click on input field
        fileInput.current.click();
    }, []);

    return <div className={className}>
        <img src={`${BACKEND_API_URL}/${profilePhotoURL}`} title={tooltip} onClick={openFileDialog}/>
        {callback != null &&
            <input type="file" accept=".jpg, .jpeg" onChange={uploadFile} ref={fileInput} id="profilePhotoFile"/>}
    </div>
};

export default ProfilePhoto;
