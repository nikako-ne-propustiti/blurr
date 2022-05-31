/**
 * @author Miljan Marković
 */
import React, {useCallback, useContext, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShowPost } from '.';
import { createComment, deletePost, getPost, toggleCommentLike, togglePostLike, follow, unlockPost } from '../../api';
import { Comment, Post } from '../../models';

type LoadState = 'INIT' | 'LOADED' | 'ERROR';

const ViewPost: React.FC = () => {
    const postId = useParams().postId || '';
    const navigate = useNavigate();
    const [loadState, setLoadState] = React.useState<LoadState>('INIT');
    const [parentCommentId, setParentCommentId] = React.useState<number>(-1);
    const [post, setPost] = useState<Post>();

    React.useEffect(() => {
        setLoadState('INIT');
        (async () => {
            const response = await getPost(postId);
            if (!response.success) {
                setLoadState('ERROR');
                return;
            }

            setPost(response.post);
            setLoadState('LOADED');
        })();
    }, [postId]);

    const setFollowing = useCallback(async (post: Post) => {
        const result = await follow(post.poster.username);
        if (result.success) {
            setPost({
                ...post,
                poster: {
                    ...post.poster,
                    amFollowing: !post.poster.amFollowing
                }
            });
        }
    }, [post, setPost]);

    const addComment = useCallback(async (post: Post, commentText: string) => {
        const response = (parentCommentId != -1 && commentText.startsWith('@')) ?
            await createComment(post.id, commentText, parentCommentId) :
            await createComment(post.id, commentText);
        if (!response.success) {
            return;
        }

        setPost({
            ...post,
            comments: [
                ...post.comments,
                response.comment
            ]
        })
    }, [post, setPost, parentCommentId]);

    const setLiked = useCallback(async (post: Post) => {
        const response = await togglePostLike(post.id);
        if (!response.success) {
            return;
        }

        setPost({
            ...post,
            haveLiked: response.haveLiked,
            likes: response.haveLiked ?
                post.likes + 1 :
                post.likes - 1
        });
    }, [post, setPost]);

    const setCommentLiked = useCallback(async (post: Post, comment: Comment) => {
        const commentToUpdate = post.comments.find(c => c.id === comment.id);
        if (!commentToUpdate) {
            return;
        }

        const response = await toggleCommentLike(comment.id);
        if (!response.success) {
            return;
        }

        const commentToUpdateIndex = post.comments.indexOf(commentToUpdate);
        const newComments = [...post.comments];
        newComments[commentToUpdateIndex] = {
            ...commentToUpdate,
            haveLiked: response.haveLiked,
            likes: response.haveLiked ?
                commentToUpdate.likes + 1 :
                commentToUpdate.likes - 1
        };
        setPost({
            ...post,
            comments: newComments
        });
    }, [post, setPost]);

    const setDeleted = useCallback(async (post: Post) => {
        const response = await deletePost(post.id);
        if (!response.success) {
            return;
        }

        navigate('/');
    }, [navigate]);

    const unlock = useCallback(async (post: Post, key: string) => {
        const result = await unlockPost(post.id, key);
        if (result.success) {
            setPost(result.post);
        }
        return Boolean(result.success);
    }, [post, setPost]);

    return (
        <>
        {loadState == 'LOADED' && post &&
            <ShowPost post={post} addComment={addComment} setFollowing={setFollowing} setLiked={setLiked} setCommentLiked={setCommentLiked} setDeleted={setDeleted} setParentCommentId={setParentCommentId} unlock={unlock}/>
        }
        {loadState == 'ERROR' && <p>Requested post does not exist.</p>}
        </>
    );
}

export default ViewPost;
