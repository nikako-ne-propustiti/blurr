import Comment from './Comment';
import User from './User';

interface Post {
    id: string;
    url: string;
    photoURL: string;
    description: string;
    likes: number;
    haveLiked: boolean;
    followingWhoLiked: string[];
    time: Date;
    poster: User;
    comments: Comment[];
}

export default Post;
