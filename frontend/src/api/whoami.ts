import {apiCall} from './base';

const whoami = () => {
    return apiCall('accounts/whoami');
};

export default whoami;
