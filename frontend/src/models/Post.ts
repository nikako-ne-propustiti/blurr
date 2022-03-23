import User from "./User";

interface Post {
    id: string;
    photoURL: string;
    description: string;
    haveLiked: boolean;
    time: Date;
    poster: User;
    comments: Comment[];
}

export default Post;
