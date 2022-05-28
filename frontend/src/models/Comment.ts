import User from "./User";

interface Comment {
    id: number;
    text: string;
    likes: number;
    time: Date;
    commenter: User;
    postId: number,
    parentCommentId: number,
    // Has the current user already liked this comment
    haveLiked: boolean;
}

export default Comment;
