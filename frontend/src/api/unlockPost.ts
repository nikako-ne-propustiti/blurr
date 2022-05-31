import { apiCall } from './base';

const unlockPost = (postId: number, key: string) => {
    return apiCall(`posts/${postId}/unlock`, {
        json: { key },
        method: 'POST'
    })
};

export default unlockPost;
