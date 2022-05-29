/**
 * @author Miljan Marković
 */
import React, {useCallback, useContext, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShowPost } from '.';
import { createComment, deletePost, getPost, toggleCommentLike, togglePostLike } from '../../api';

import { Comment, Post } from '../../models';
import { Context } from '../../shared/Context';

type LoadState = 'INIT' | 'LOADED' | 'ERROR';

const ViewPost: React.FC = () => {
    const postId = useParams().postId || '';
    const {state} = useContext(Context);
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
    }, []);

    const setFollowing = useCallback((post: Post) => {
        setPost({
            ...post,
            poster: {
                ...post.poster,
                amFollowing: !post.poster.amFollowing
            }
        });
    }, [post, setPost]);

    const addComment = useCallback(async(post: Post, commentText: string) => {
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
    }, [post, setPost]);

    const setLiked = useCallback(async(post: Post) => {
        const response = await togglePostLike(post.id);
        if (!response.success) {
            return;
        }

        setPost({
            ...post,
            haveLiked: response.haveLiked
        });
    }, [post, setPost]);

    const setCommentLiked = useCallback(async(post: Post, comment: Comment) => {
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
            haveLiked: response.haveLiked
        };
        setPost({
            ...post,
            comments: newComments
        });
    }, [post, setPost]);

    const setDeleted = useCallback(async(post: Post) => {
        const response = await deletePost(post.id);
        if (!response.success) {
            return;
        }

        navigate('/');
    }, [navigate]);

    return (
        <>
        {loadState == 'LOADED' && post &&
            <ShowPost post={post} addComment={addComment} setFollowing={setFollowing} setLiked={setLiked} setCommentLiked={setCommentLiked} setDeleted={setDeleted} setParentCommentId={setParentCommentId} />
        }
        </>
    );
}

export default ViewPost;
