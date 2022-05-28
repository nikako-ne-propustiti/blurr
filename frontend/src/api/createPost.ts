import {apiCall} from './base';

const createPost = (form: FormData) => {
    return apiCall('/p/new', {
        form,
        method: 'POST'
    });
};

export default createPost;
