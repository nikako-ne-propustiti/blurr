import {apiCall} from './base';
import {Post} from '../models';

type ReviewApiResponse =
    {success: false, error: string} |
    {success: true, posts: Post[]};

const getReview = (): Promise<ReviewApiResponse> => {
    return apiCall('review');
};

export default getReview;
