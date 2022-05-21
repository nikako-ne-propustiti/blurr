import {apiCall} from './base';
import {User} from "../models";

type AccountInfoResponse =
    { success: false, error: string } |
    { success: true, account: User };

const accountInfo = (username: string): Promise<AccountInfoResponse> => {
    return apiCall('accounts/info', {
        query: {username},
    });
};

export default accountInfo;
