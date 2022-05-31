import { Comment } from '../models';
import {apiCall} from './base';

type CommentApiResponse =
    {success: false, error: string} |
    {success: true, comment: Comment};

const createComment = (postId: number, text: string, parentCommentId?: number):
    Promise<CommentApiResponse> => {
    return apiCall(`/comments/${postId}`, {
        method: 'POST',
        json: {
            comment: {
                text,
                time: new Date(),
                parentCommentId
            }
        }
    });
};

export default createComment;
