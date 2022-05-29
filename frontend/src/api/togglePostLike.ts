import {apiCall} from './base';

type ToggleLikeApiResponse =
    {success: false, error: string} |
    {success: true, haveLiked: boolean};

const togglePostLike = (postId: string): Promise<ToggleLikeApiResponse> => {
    return apiCall(`posts/${postId}/likes`, {
        method: 'POST'
    })
};

export default togglePostLike;
