import {apiCall} from './base';

const follow = (username: string) => {
    return apiCall('accounts/follow', {
        json: {username},
        method: 'POST'
    });
};

export default follow;
