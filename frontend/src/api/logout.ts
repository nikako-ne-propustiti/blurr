import {apiCall} from './base';

const logout = () => {
    return apiCall('accounts/logout', {
        method: 'DELETE'
    });
};

export default logout;
