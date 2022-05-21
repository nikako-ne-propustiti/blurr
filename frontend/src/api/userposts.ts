import {apiCall} from './base';
import {PostBasicInfo} from "../models";

type UserPostsResponse =
    { success: false, error: string } |
    { success: true, posts: PostBasicInfo[], left: number };

const userPosts = (username: string, lastIndex : number): Promise<UserPostsResponse> => {
    return apiCall('accounts/posts', {
        query: {username, lastIndex},
    });
};

export default userPosts;
