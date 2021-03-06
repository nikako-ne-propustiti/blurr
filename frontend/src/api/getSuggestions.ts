import {apiCall} from './base';
import {User} from "../models";

type SuggestionsResponse =
    { success: false, error: string } |
    { success: true, suggestions: User[] };

const getSuggestions = (): Promise<SuggestionsResponse> => {
    return apiCall('posts/suggestions');
};

export default getSuggestions;
