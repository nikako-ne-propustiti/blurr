import {apiCall} from './base';
import {Post} from '../models';

type PostApiResponse =
    {success: false, error: string} |
    {success: true, post: Post};

const getPost = (postId: string): Promise<PostApiResponse> => {
    return apiCall(`/posts/${postId}`);
};

export default getPost;
