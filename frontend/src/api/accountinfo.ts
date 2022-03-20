import {apiCall} from './base';

const accountInfo = (username: string) => {
    return apiCall('accounts/info', {
        json: {username}
    });
};

export default accountInfo;
