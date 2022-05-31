import {apiCall} from './base';

type ToggleLikeApiResponse =
    {success: false, error: string} |
    {success: true, haveLiked: boolean};

const toggleCommentLike = (commentId: number): Promise<ToggleLikeApiResponse> => {
    return apiCall(`comments/${commentId}/likes`, {
        method: 'POST'
    })
};

export default toggleCommentLike;
