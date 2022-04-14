import React, {useState, FormEvent, useCallback, useContext, useRef} from 'react';
import {ShowComment} from './comments';
import {Post, Comment} from '../../models';
import Icon from '../../shared/Icon';
import {Link, useNavigate} from 'react-router-dom';
import Button from '../../shared/Button';
import {Context} from '../../shared/Context';

import './ShowPost.css';

interface Props {
    addComment?: (post: Post, comment: string) => void;
    post: Post;
    setCommentLiked?: (post: Post, comment: Comment) => void;
    setDeleted?: (post: Post) => void;
    setFollowing?: (post: Post) => void;
    setLiked?: (post: Post) => void;
}

const imageDoubleClick = () => {
    console.log('Double click');
};

const ShowPost: React.FC<Props> = ({addComment, post, setCommentLiked, setDeleted, setFollowing, setLiked}) => {
    const commentInputRef = useRef<HTMLInputElement>(null);
    const {state} = useContext(Context);
    const navigate = useNavigate();
    const [commentInput, setCommentInput] = useState('');
    const showComments = addComment && setCommentLiked;
    const loginFirst = useCallback(() => {
        const currentUrl = `/p/${post.id}`;
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
    const onReply = useCallback((user: string) => {
        if (state.loggedIn) {
            setCommentInput(`@${user} `);
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
        <article className="wrapper">
            <img onDoubleClick={imageDoubleClick} src={post.photoURL} />
            <div className="panel">
                <div className="profile-bar">
                    <Link to={`/${post.poster.username}`}>
                        <img src={post.poster.profilePhotoURL}></img>
                    </Link>
                    <Link to={`/${post.poster.username}`}>
                        {post.poster.username}
                    </Link>
                    {setFollowing && <span className="dot-separator">•</span>}
                    {setFollowing && <Button text={post.poster.amFollowing ? 'Unfollow' : 'Follow'} onClick={onFollow} />}
                </div>

                {showComments && <div className="comments">
                    <ul>
                    {post.comments.map(c => <ShowComment comment={c} key={c.id} onReply={onReply} onLike={onCommentLike} />)}
                    </ul>
                </div>}

                {showComments && <div className="post-bottom">
                    {setLiked && <button onClick={onLike}><Icon name={post.haveLiked ? 'favorite' : 'favorite_border'} /></button>}
                    {post.poster.username === state.currentUser && setDeleted && <button onClick={onDelete}><Icon name="delete" /></button>}
                    <input type="text" className="key-box" placeholder="Enter the key" />
                    <div>
                        Liked by stan, elizabeth, and 39 others
                    </div>
                </div>}

                {showComments && <form className="comment-wrapper" onSubmit={onComment}>
                    <input onChange={inputChange} type="text" name="text" className="comment-box" placeholder="Add a comment" ref={commentInputRef} value={commentInput} />
                    <Button text="Post" disabled={!commentInput} />
                </form>}

            </div>
        </article>
    );
}

export default ShowPost;
