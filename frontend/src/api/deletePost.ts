import {apiCall} from './base';

type DeletePostApiResponse =
    {success: false, error: string} |
    {success: true};

const deletePost = (postId: number): Promise<DeletePostApiResponse> => {
    return apiCall(`posts/${postId}`, {
        method: 'DELETE',
    });
};

export default deletePost;
