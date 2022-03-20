import {apiCall} from './base';

// Used for preview posts on the user account page
// Fetches first 20 posts before lastPostUuid (used for pages/scrolling)
// If not specified, fetches the newest
const getPostsByUser = (username: string, lastPostUuid?: string) => {
    return apiCall('accounts/previewposts', {
        json: {username, lastPostUuid}
    });
};

export default getPostsByUser;
