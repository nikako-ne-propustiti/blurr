import {apiCall} from './base';

// Used for preview posts on the user account page
// Fetches first 20 posts before lastPostUuid (used for pages/scrolling)
// If not specified, fetches the newest
const previewPosts = (username: string, lastPostUuid: string | undefined = undefined) => {
    return apiCall('accounts/previewposts', {
        json: {username, lastPostUuid},
        method: 'GET'
    });
};

export default previewPosts;
