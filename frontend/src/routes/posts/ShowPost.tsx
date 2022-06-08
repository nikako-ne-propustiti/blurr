import React, {useState, FormEvent, useCallback, useContext, useRef} from 'react';
import {ShowComment} from './comments';
import {Post, Comment} from '../../models';
import Icon from '../../shared/Icon';
import {Link, useNavigate} from 'react-router-dom';
import Button from '../../shared/Button';
import {Context} from '../../shared/Context';
import {CDN_URL} from '../../api';

import './ShowPost.css';

interface Props {
    isReview?: boolean;
    addComment?: (post: Post, comment: string) => void;
    post: Post;
    setCommentLiked?: (post: Post, comment: Comment) => void;
    setDeleted?: (post: Post) => void;
    setFollowing?: (post: Post) => void;
    setLiked?: (post: Post) => void;
    unlock?: (post: Post, key: string) => Promise<boolean>;
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

const ShowPost: React.FC<Props> = ({isReview, addComment, post, setCommentLiked, setDeleted, setFollowing, setLiked, setParentCommentId, unlock}) => {
    const commentInputRef = useRef<HTMLInputElement>(null);
    const {state} = useContext(Context);
    const navigate = useNavigate();
    const [commentInput, setCommentInput] = useState('');
    const [keyInput, setKeyInput] = useState('');
    const [unlockError, setUnlockError] = useState(false);
    const showComments = addComment && setCommentLiked;
    const canFollow = setFollowing && state.currentUser !== post.poster.username;
    const canUnlock = unlock && !post.unlocked;
    const canDelete = post.poster.username === state.currentUser && setDeleted;
    const photoURL = isReview && post.reviewPhotoURL || post.photoURL;

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

    const onUnlock = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (state.loggedIn) {
            if (unlock) {
                const successful = await unlock(post, keyInput);
                setUnlockError(!successful);
                if (successful) {
                    setKeyInput('');
                }
            }
        } else {
            loginFirst();
        }
    }, [post, unlock, keyInput, setKeyInput, state, loginFirst, setUnlockError]);

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
    }, [setCommentInput, commentInputRef, setCommentInput, state, loginFirst, setParentCommentId]);

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

    const commentInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCommentInput(e.target.value);
    }, [setCommentInput]);

    const keyInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setUnlockError(false);
        }
        setKeyInput(e.target.value);
    }, [setKeyInput, setUnlockError]);


    return (
        <article className="post-wrapper">
            <div className="post">
                <img onDoubleClick={onLike} src={`${CDN_URL}${photoURL}`} />
                <div className="panel">
                    <div className="profile-bar">
                        <Link to={`/${post.poster.username}`}>
                            <img src={`${CDN_URL}${post.poster.profilePhotoURL}`}></img>
                        </Link>
                        <Link to={`/${post.poster.username}`}>
                            {post.poster.username}
                        </Link>
                        {canFollow && <span className="dot-separator">•</span>}
                        {canFollow && <Button text={post.poster.amFollowing ? 'Unfollow' : 'Follow'} onClick={onFollow} />}
                    </div>

                    {showComments && <div className="comments">
                        <ul>
                        <ShowComment comment={postToComment(post)} key={-1} onLike={onLike} />
                        {orderComments(post.comments).map(c => <ShowComment comment={c} key={c.id} onReply={onReply} onLike={onCommentLike} />)}
                        </ul>
                    </div>}

                    {showComments && <form className="comment-wrapper" onSubmit={onComment}>
                        <input onChange={commentInputChange} type="text" name="text" className="comment-box" placeholder="Add a comment" ref={commentInputRef} value={commentInput} />
                        <Button text="Post" disabled={!commentInput} />
                    </form>}

                    {canUnlock && <form className={`key-wrapper ${unlockError ? 'unlock-error' : ''}`} onSubmit={onUnlock}>
                        <input onChange={keyInputChange} type="text" name="text" className="key-box" placeholder="Enter the key" value={keyInput}/>
                        <Button text="Unlock" disabled={!keyInput} />
                    </form>}

                    {showComments && <div className="post-bottom">
                        {canDelete && <button onClick={onDelete}><Icon name="delete" /></button>}
                        <div>{formatLikes(post.followingWhoLiked, post.likes)}</div>
                    </div>}

                </div>
            </div>
        </article>
    );
}

export default ShowPost;
