import {apiCall} from './base';

const editAccount = (realName: string) => {
    return apiCall('users', {
        json: {realName},
        method: 'PATCH'
    });
};

export default editAccount;
