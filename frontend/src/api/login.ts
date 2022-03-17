import {apiCall} from './base';

const login = (username: string, password: string) => {
    return apiCall('accounts/login', {
        json: {username, password},
        method: 'POST'
    });
};

export default login;
