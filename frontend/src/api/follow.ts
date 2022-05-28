import {apiCall} from './base';

const follow = (username: string) => {
    return apiCall('users/follow', {
        json: {username},
        method: 'POST'
    });
};

export default follow;
