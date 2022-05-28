import {apiCall} from './base';
import {Post} from "../models";

type PostsResponse =
    { success: false, error: string } |
    { success: true, posts: Post[], left: number };

const posts = (lastIndex: number, username?: string): Promise<PostsResponse> => {
    return apiCall('posts', {
        query: {lastIndex, username},
    });
};

export default posts;
