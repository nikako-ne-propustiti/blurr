import User from "./User";

interface Comment {
    id: string;
    text: string;
    likes: number;
    time: Date;
    commenter: User;
    // Has the current user already liked this comment
    haveLiked: boolean;
}

export default Comment;
