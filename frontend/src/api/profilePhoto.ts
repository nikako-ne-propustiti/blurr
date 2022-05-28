import {apiCall} from './base';

const profilePhoto = (form : FormData) => {
    return apiCall('accounts/pfp', {
        form,
        method: 'POST'
    });
};

export default profilePhoto;
