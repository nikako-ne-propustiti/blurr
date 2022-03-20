import User from "./User";

interface Post {
    photoURL: string;
    description: string;
    time: Date;
    poster: User;
    comments: Comment[];
}

export default Post;
