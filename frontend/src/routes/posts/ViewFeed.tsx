/**
 * @author Aleksa Marković
 */
import React, {useCallback, useContext} from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import ShowPost from './ShowPost';
import FollowSuggestions from '../accounts/FollowSuggestions';
import { Comment, Post, User } from '../../models';
import { Context } from '../../shared/Context';
import InfiniteScroll from '../../shared/InfiniteScroll';

import './ViewFeed.css';
import { apiCall } from '../../api/base';

const generateMockUser = (): User => {
    const id = Math.round((100000 * Math.random()));
    return {
        id: id,
        username: `acc-${id}`,
        profileURL: `acc-${id}`,
        profilePhotoURL: `https://picsum.photos/128/128?nocache=${Math.random()}`,
        amFollowing: false,
        numberFollowing: Math.round((1000 * Math.random())),
        numberOfFollowers: Math.round((1000 * Math.random())),
        numberOfPosts: Math.round((1000 * Math.random())),
        realName: 'John Doe'
    }
}

const generateMockUsers = (number: number): User[] => {
    return new Array(number).fill(null).map(generateMockUser);
 }

const generateMockPosts = (number: number): Post[] => {
    return new Array(number).fill(null).map(() => {
        return {
            id: Math.round((100000 * Math.random())).toFixed(),
            photoURL: `https://picsum.photos/512/512?blur=${Math.round((10 * Math.random())).toFixed()}&nocache=${Math.random()}`,
            description: 'Description',
            haveLiked: Math.random() < 0.5,
            time: new Date(),
            poster: generateMockUser(),
            comments: []
        }
    });
}

const ViewFeed: React.FC = () => {
    const [searchParams] = useSearchParams();
    const {state: context} = useContext(Context);
    const [posts, setPosts] = React.useState<Post[]>([]);
    const [parentCommentId, setParentCommentId] = React.useState<number>(-1);

    React.useEffect(() => {
        setPosts(generateMockPosts(5));
    }, []);

    // Infinite scrolling callback
    const handleInfiniteScroll = React.useCallback(() => {
        setPosts(posts.concat(generateMockPosts(10)));
    }, [posts, setPosts]);

    const setFollowing = useCallback((post: Post) => {
        const postToUpdate = posts.find(p => p.id === post.id);
        if (postToUpdate) {
            const newPosts = [...posts];
            const postToUpdateIndex = posts.indexOf(postToUpdate);
            newPosts[postToUpdateIndex] = {
                ...postToUpdate,
                poster: {
                    ...postToUpdate.poster,
                    amFollowing: !postToUpdate.poster.amFollowing
                }
            };
            setPosts(newPosts);
        }
    }, [posts, setPosts]);

    const addComment = useCallback((post: Post, commentText: string) => {
        const postToUpdate = posts.find(p => p.id === post.id);
        if (!postToUpdate) {
            return;
        }

        const commmentJSON: any = {
            text: commentText,
            time: new Date()
        }
        if (parentCommentId != -1 && commentText.startsWith('@')) {
            commmentJSON['parentCommentId'] = parentCommentId;
        }

        apiCall(`comments/${post.id}`, {
            method: 'POST',
            json: { comment: commmentJSON }
        }).then(({comment}) => {
            console.log('commentRes', comment);
            const newPosts = [...posts];
            const postToUpdateIndex = posts.indexOf(postToUpdate);
            newPosts[postToUpdateIndex] = {
                ...postToUpdate,
                comments: [
                    ...postToUpdate.comments,
                    comment
                ]
            };
            setPosts(newPosts);
        });
    }, [posts, setPosts, parentCommentId, setParentCommentId]);

    const setLiked = useCallback((post: Post) => {
        const postToUpdate = posts.find(p => p.id === post.id);
        if (!postToUpdate) {
            return;
        }
        apiCall(`posts/${post.id}/likes`, {
            method: 'POST'
        }).then(data => {
            const newPosts = [...posts];
            const postToUpdateIndex = posts.indexOf(postToUpdate);
            newPosts[postToUpdateIndex] = {
                ...postToUpdate,
                haveLiked: !data.haveLiked
            };
            setPosts(newPosts);
        });
    }, [posts, setPosts]);

    const setCommentLiked = useCallback((post: Post, comment: Comment) => {
        const postToUpdate = posts.find(p => p.id === post.id);
        if (!postToUpdate) {
            return;
        }

        const newPosts = [...posts];
        const postToUpdateIndex = posts.indexOf(postToUpdate);
        const commentToUpdate = postToUpdate.comments.find(c => c.id === comment.id);
        if (!commentToUpdate) {
            return;
        }

        apiCall(`comments/${comment.id}/likes`, {
            method: 'POST'
        }).then(data => {
            const commentToUpdateIndex = postToUpdate.comments.indexOf(commentToUpdate);
            const newComments = [...postToUpdate.comments];
            newComments[commentToUpdateIndex] = {
                ...commentToUpdate,
                haveLiked: !data.haveLiked
            };
            newPosts[postToUpdateIndex] = {
                ...postToUpdate,
                comments: newComments
            };
            setPosts(newPosts);
        })
    }, [posts, setPosts]);

    return (
        <>
            {context.loggedIn || <Navigate to="/accounts/login" />}
            {searchParams.get("nofollow") ?
                <>
                    <h1>Suggestions</h1>
                    <FollowSuggestions users={generateMockUsers(10)} />
                </> :
                <>
                    <InfiniteScroll callback={handleInfiniteScroll} />
                    <section className="feed-list">
                        {posts.map((post) =>
                            <ShowPost post={post} key={post.id} addComment={addComment} setFollowing={setFollowing} setLiked={setLiked} setCommentLiked={setCommentLiked} setParentCommentId={setParentCommentId} />
                        )}
                    </section>
                </>}
        </>
    );
}

export default ViewFeed;
