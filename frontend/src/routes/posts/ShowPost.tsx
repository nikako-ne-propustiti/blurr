import React, {useState, FormEvent, useCallback, useContext, useRef} from 'react';
import {ShowComment} from './comments';
import {Post, Comment} from '../../models';
import Icon from '../../shared/Icon';
import {Link, useNavigate} from 'react-router-dom';
import Button from '../../shared/Button';
import {Context} from '../../shared/Context';
import {BACKEND_API_URL} from '../../api';

import './ShowPost.css';

interface Props {
    addComment?: (post: Post, comment: string) => void;
    post: Post;
    setCommentLiked?: (post: Post, comment: Comment) => void;
    setDeleted?: (post: Post) => void;
    setFollowing?: (post: Post) => void;
    setLiked?: (post: Post) => void;
    setParentCommentId?: (id: number) => void;
}

const formatLikes = (users: string[], count: number): string => {
    if (count === 0) {
        return '';
    }
    if (users.length === 0) {
        if (count === 1) {
            return `Liked by 1 user`;
        }
        return `Liked by ${count} users`;
    }
    if (users.length === 1) {
        if (count === 1) {
            return `Liked by ${users[0]}`;
        }
        return `Liked by ${users[0]} and ${count - 1} more`
    }
    const slice = users.slice(0, 3);
    if (slice.length === count) {
        const last = slice.pop();
        return `Liked by ${slice.join(', ')} and ${last}`;
    }
    return `Liked by ${slice.join(', ')} and ${count - slice.length} more`;
};

const postToComment = (post: Post): Comment => {
    return {
        id: post.id,
        text: post.description,
        likes: post.likes,
        time: post.time,
        commenter: post.poster,
        postId: post.id,
        haveLiked: post.haveLiked
    };
};

const orderComments = (comments: Comment[]): Comment[] => {
    const notReplies = comments
        .filter(c => typeof c.parentCommentId !== 'number')
        .sort((c1, c2) => (new Date(c1.time)).getTime() - (new Date(c2.time)).getTime());
    let replies = comments.filter(c => typeof c.parentCommentId === 'number');
    const sortedComments = [];
    for (const comment of notReplies) {
        sortedComments.push(comment, ...replies.filter(r => r.parentCommentId === comment.id));
        replies = replies.filter(r => r.parentCommentId !== comment.id);
    }
    return sortedComments;
};

const ShowPost: React.FC<Props> = ({addComment, post, setCommentLiked, setDeleted, setFollowing, setLiked, setParentCommentId}) => {
    const commentInputRef = useRef<HTMLInputElement>(null);
    const {state} = useContext(Context);
    const navigate = useNavigate();
    const [commentInput, setCommentInput] = useState('');
    const showComments = addComment && setCommentLiked;

    const loginFirst = useCallback(() => {
        const currentUrl = `/p/${post.url}`;
        navigate(`/accounts/login?returnTo=${encodeURIComponent(currentUrl)}`);
    }, [post, navigate]);

    const onFollow = useCallback(() => {
        if (state.loggedIn) {
            if (setFollowing) {
                setFollowing(post);
            }
        } else {
            loginFirst();
        }
    }, [post, setFollowing, state, loginFirst]);

    const onComment = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (state.loggedIn) {
            if (addComment) {
                addComment(post, commentInput);
                setCommentInput('');
            }
        } else {
            loginFirst();
        }
    }, [post, addComment, commentInput, setCommentInput, state, loginFirst]);

    const onReply = useCallback((user: string, id: number) => {
        if (state.loggedIn) {
            setCommentInput(`@${user} `);
            if (setParentCommentId) {
                setParentCommentId(id);
            }
            commentInputRef.current?.focus();
        } else {
            loginFirst();
        }
    }, [setCommentInput, commentInputRef, setCommentInput, state, loginFirst]);

    const onLike = useCallback(() => {
        if (state.loggedIn) {
            if (setLiked) {
                setLiked(post);
            }
        } else {
            loginFirst();
        }
    }, [post, setLiked, state, loginFirst]);

    const onCommentLike = useCallback((comment: Comment) => {
        if (state.loggedIn) {
            if (setCommentLiked) {
                setCommentLiked(post, comment);
            }
        } else {
            loginFirst();
        }
    }, [post, setCommentLiked, state, loginFirst]);

    const onDelete = useCallback(() => {
        if (setDeleted) {
            setDeleted(post);
        }
    }, [post, setDeleted]);

    const inputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCommentInput(e.target.value);
    }, [setCommentInput]);

    return (
        <article className="post-wrapper">
            <div className="post">
                <img onDoubleClick={onLike} src={`${BACKEND_API_URL}/${post.photoURL}`} />
                <div className="panel">
                    <div className="profile-bar">
                        <Link to={`/${post.poster.username}`}>
                            <img src={`${BACKEND_API_URL}/${post.poster.profilePhotoURL}`}></img>
                        </Link>
                        <Link to={`/${post.poster.username}`}>
                            {post.poster.username}
                        </Link>
                        {setFollowing && <span className="dot-separator">•</span>}
                        {setFollowing && <Button text={post.poster.amFollowing ? 'Unfollow' : 'Follow'} onClick={onFollow} />}
                    </div>

                    {showComments && <div className="comments">
                        <ul>
                        <ShowComment comment={postToComment(post)} key={-1} onLike={onLike} />
                        {orderComments(post.comments).map(c => <ShowComment comment={c} key={c.id} onReply={onReply} onLike={onCommentLike} />)}
                        </ul>
                    </div>}

                    {showComments && <div className="post-bottom">
                        {post.poster.username === state.currentUser && setDeleted && <button onClick={onDelete}><Icon name="delete" /></button>}
                        <input type="text" className="key-box" placeholder="Enter the key" />
                        <div className="likes">{formatLikes(post.followingWhoLiked, post.likes)}</div>
                    </div>}

                    {showComments && <form className="comment-wrapper" onSubmit={onComment}>
                        <input onChange={inputChange} type="text" name="text" className="comment-box" placeholder="Add a comment" ref={commentInputRef} value={commentInput} />
                        <Button text="Post" disabled={!commentInput} />
                    </form>}
                </div>
            </div>
        </article>
    );
}

export default ShowPost;
