import {apiCall} from './base';

const register = (username: string, password: string, name: string) => {
    return apiCall('accounts/register', {
        json: {username, password, name},
        method: 'POST'
    });
};

export default register;
