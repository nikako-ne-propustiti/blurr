import {apiCall} from './base';

const accountInfo = (username: string) => {
    return apiCall('accounts/login', {
        json: {username},
        method: 'GET'
    });
};

export default accountInfo;
