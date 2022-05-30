import Comment from './Comment';
import User from './User';

interface Post {
    id: number;
    url: string;
    photoURL: string;
    reviewPhotoURL?: string;
    description: string;
    likes: number;
    haveLiked: boolean;
    followingWhoLiked: string[];
    time: Date;
    poster: User;
    comments: Comment[];
}

export default Post;
