import {apiCall} from './base';

const userInfo = (username: string) => {
    return apiCall('accounts/info', {
        json: {username}
    });
};

export default userInfo;
