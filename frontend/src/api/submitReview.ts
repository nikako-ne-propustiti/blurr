import {apiCall} from './base';

const submitReview = (postId: string, approve: boolean) => {
    return apiCall(`review/${postId}`, {
        json: {approve},
        method: 'POST'
    });
};

export default submitReview;
