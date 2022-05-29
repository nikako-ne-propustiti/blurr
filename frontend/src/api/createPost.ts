import {apiCall} from './base';

const createPost = (form: FormData) => {
    return apiCall('posts', {
        form,
        method: 'POST'
    });
};

export default createPost;
