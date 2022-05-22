import {apiCall} from './base';
import {Post} from "../models";

type FeedResponse =
    { success: false, error: string } |
    { success: true, posts: Post[], left: number };

const feed = (lastIndex : number): Promise<FeedResponse> => {
    return apiCall('posts/feed', {
        query: {lastIndex},
    });
};

export default feed;
