import {apiCall} from './base';

const submitReview = (postId: number, approve: boolean) => {
    return apiCall(`review/${postId}`, {
        json: {approve},
        method: 'POST'
    });
};

export default submitReview;
