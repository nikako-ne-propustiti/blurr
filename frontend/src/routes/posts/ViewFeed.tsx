import React, {useCallback, useContext} from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import ShowPost from './ShowPost';
import FollowSuggestions from '../accounts/FollowSuggestions';
import { Comment, Post, User } from '../../models';
import { Context } from '../../shared/Context';
import InfiniteScroll from '../../shared/InfiniteScroll';

import './ViewFeed.css';

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

    React.useEffect(() => {
        setPosts(generateMockPosts(5));
    }, []);

    // Infinite scrolling callback
    const handleInfiniteScroll = React.useCallback(() => {
        setPosts(posts.concat(generateMockPosts(10)));
    }, [posts]);

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
    }, [posts]);
    const addComment = useCallback((post: Post, comment: string) => {
        const postToUpdate = posts.find(p => p.id === post.id);
        if (postToUpdate) {
            const newPosts = [...posts];
            const postToUpdateIndex = posts.indexOf(postToUpdate);
            newPosts[postToUpdateIndex] = {
                ...postToUpdate,
                comments: [
                    ...postToUpdate.comments,
                    {
                        id: Math.round(Math.random() * 10000),
                        text: comment,
                        likes: 0,
                        time: new Date(),
                        commenter: {
                            id: 1,
                            username: context.currentUser || 'unknown',
                            realName: context.currentUser || 'unknown',
                            profileURL: "https://picsum.photos/400",
                            profilePhotoURL: "https://picsum.photos/400",
                            amFollowing: true,
                            numberOfPosts: 0,
                            numberOfFollowers: 0,
                            numberFollowing: 0
                        },
                        haveLiked: false
                    }
                ]
            };
            setPosts(newPosts);
        }
    }, [posts]);
    const setLiked = useCallback((post: Post) => {
        const postToUpdate = posts.find(p => p.id === post.id);
        if (postToUpdate) {
            const newPosts = [...posts];
            const postToUpdateIndex = posts.indexOf(postToUpdate);
            newPosts[postToUpdateIndex] = {
                ...postToUpdate,
                haveLiked: !postToUpdate.haveLiked
            };
            setPosts(newPosts);
        }
    }, [posts]);
    const setCommentLiked = useCallback((post: Post, comment: Comment) => {
        const postToUpdate = posts.find(p => p.id === post.id);
        if (postToUpdate) {
            const newPosts = [...posts];
            const postToUpdateIndex = posts.indexOf(postToUpdate);
            const commentToUpdate = postToUpdate.comments.find(c => c.id === comment.id);
            if (commentToUpdate) {
                const commentToUpdateIndex = post.comments.indexOf(commentToUpdate);
                const newComments = [...post.comments];
                newComments[commentToUpdateIndex] = {
                    ...commentToUpdate,
                    haveLiked: !commentToUpdate.haveLiked
                };
                newPosts[postToUpdateIndex] = {
                    ...postToUpdate,
                    comments: newComments
                };
                setPosts(newPosts);
            }
        }
    }, [posts]);
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
                            <ShowPost post={post} key={post.id} addComment={addComment} setFollowing={setFollowing} setLiked={setLiked} setCommentLiked={setCommentLiked} />
                        )}
                    </section>
                </>}
        </>
    );
}

export default ViewFeed;
