import {apiCall} from './base';

const profilePhoto = (form : FormData) => {
    return apiCall('users/pfp', {
        form,
        method: 'POST'
    });
};

export default profilePhoto;
