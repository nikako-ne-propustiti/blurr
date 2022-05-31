import {apiCall} from './base';
import {Post} from '../models';

type UnlockPostResponse =
    {success: true, post: Post} |
    {success: false, error: string};

const unlockPost = (postId: number, key: string): Promise<UnlockPostResponse> => {
    return apiCall(`posts/${postId}/unlock`, {
        json: { key },
        method: 'POST'
    })
};

export default unlockPost;
