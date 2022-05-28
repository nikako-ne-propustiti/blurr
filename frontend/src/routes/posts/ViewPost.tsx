/**
 * @author Miljan Marković
 */
import React, {useCallback, useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { ShowPost } from '.';

import { Comment, User, Post } from '../../models';
import { Context } from '../../shared/Context';

const users: User[] = [
    {
        id: 1,
        username: "john", 
        realName: "john doe",
        profilePhotoURL: "https://picsum.photos/400",
        amFollowing: true,
        numberOfPosts: 0,
        numberOfFollowers: 0,
        numberFollowing: 0
    },
    {
        id: 2,
        username: "alex", 
        realName: "alex young",
        profilePhotoURL: "https://picsum.photos/500",
        amFollowing: false,
        numberOfPosts: 0,
        numberOfFollowers: 0,
        numberFollowing: 0
    },
    {
        id: 3,
        username: "sara", 
        realName: "sara mack",
        profilePhotoURL: "https://picsum.photos/600",
        amFollowing: false,
        numberOfPosts: 0,
        numberOfFollowers: 0,
        numberFollowing: 0
    }
];

const comments: Comment[] = [
    {
        id: 1,
        text: "zdravo",
        likes: 1,
        time: new Date(),
        commenter: users[0],
        haveLiked: false
    },
    {
        id: 2,
        text: "pozdrav",
        likes: 1,
        time: new Date(),
        commenter: users[2],
        haveLiked: true
    },
    {
        id: 3,
        text: "cao",
        likes: 0,
        time: new Date(),
        commenter: users[0],
        haveLiked: true
    }
];

const ViewPost: React.FC = () => {
    const [post, setPost] = useState<Post>({
        id: "id",
        poster: users[1],
        photoURL : 'https://picsum.photos/512/512?nocache=',
        time: new Date(),
        description: "hello",
        likes : 20,
        comments,
        haveLiked: false
    });
    const setFollowing = useCallback((post: Post) => {
        setPost({
            ...post,
            poster: {
                ...post.poster,
                amFollowing: !post.poster.amFollowing
            }
        });
    }, [post, setPost]);
    const {state} = useContext(Context);
    const navigate = useNavigate();
    const addComment = useCallback((post: Post, comment: string) => {
        setPost({
            ...post,
            comments: [
                ...post.comments,
                {
                    id: Math.round(Math.random() * 10000),
                    text: comment,
                    likes: 0,
                    time: new Date(),
                    commenter: {
                        id: 1,
                        username: state.currentUser || 'unknown',
                        realName: state.currentUser || 'unknown',
                        profilePhotoURL: "https://picsum.photos/400",
                        amFollowing: true,
                        numberOfPosts: 0,
                        numberOfFollowers: 0,
                        numberFollowing: 0
                    },
                    haveLiked: false
                }
            ]
        })
    }, [post, setPost]);
    const setLiked = useCallback((post: Post) => {
        setPost({
            ...post,
            haveLiked: !post.haveLiked
        });
    }, [post, setPost]);
    const setCommentLiked = useCallback((post: Post, comment: Comment) => {
        const commentToUpdate = post.comments.find(c => c.id === comment.id);
        if (commentToUpdate) {
            const commentToUpdateIndex = post.comments.indexOf(commentToUpdate);
            const newComments = [...post.comments];
            newComments[commentToUpdateIndex] = {
                ...commentToUpdate,
                haveLiked: !commentToUpdate.haveLiked
            };
            setPost({
                ...post,
                comments: newComments
            });
        }
    }, [post, setPost]);
    const setDeleted = useCallback(() => {
        navigate('/');
    }, [navigate]);
    return (
        <ShowPost post={post} addComment={addComment} setFollowing={setFollowing} setLiked={setLiked} setCommentLiked={setCommentLiked} setDeleted={setDeleted} />
    );
}

export default ViewPost;
