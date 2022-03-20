import User from "./User";

interface Post {
    postID : string;
    photoURL: string;
    description: string;
    time: Date;
    poster: User;
    comments: Comment[];
}

export default Post;
