import {apiCall} from './base';

const follow = (username: string) => {
    return apiCall(`users/${username}/follow`, {
        method: 'POST'
    });
};

export default follow;
