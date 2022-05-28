import React from 'react';

import './ProfilePhoto.css';

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
    // TODO This will also have to be written a bit nicer
    const uploadFile = React.useCallback(() => {
        if (!fileInput.current) return;
        if (callback)
            callback(fileInput.current.files?.item(0));
        /*
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

        if (file.size > 2048 * 1024) {
            alert("Maximum 2 MB for profile photo.");
            return;
        }

        // Simulated upload
        setProfilePhotoURL(URL.createObjectURL(file));
        // The server would inform us about the file being inadequate in any other way
        // E.g. resolution, etc.
         */
    }, [fileInput]);

    const openFileDialog = React.useCallback(() => {
        if (!fileInput.current) return;

        // Simulate click on input field
        fileInput.current.click();
    }, []);

    return <div className={className}>
        <img src={profilePhotoURL} title={tooltip} onClick={openFileDialog}/>
        {callback != null &&
            <input type="file" accept=".jpg, .jpeg" onChange={uploadFile} ref={fileInput} id="profilePhotoFile"/>}
    </div>
};

export default ProfilePhoto;
