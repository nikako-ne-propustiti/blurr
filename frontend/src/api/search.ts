import {apiCall} from './base';
import {User} from "../models";

type SearchResponse =
    { success: false, error: string } |
    { success: true, users: User[] };

const search = (query: string): Promise<SearchResponse> => {
    return apiCall('users', {
        query: {query}
    });
};

export default search;
