import React, { useContext } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import ShowPost from './ShowPost';
import FollowSuggestions from '../accounts/FollowSuggestions';
import { Post, User } from '../../models';
import { Context } from '../../shared/Context';
import InfiniteScroll from '../../shared/InfiniteScroll';

import './ViewFeed.css';

const generateMockUser = (): User => {
    const id = Math.round((100000 * Math.random()));
    return {
        id: id,
        username: `acc-${id}`,
        profileURL: `acc-${id}`,
        profilePhotoURL: `http://picsum.photos/128/128?nocache=${Math.random()}`,
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
            photoURL: `http://picsum.photos/512/512?blur=${Math.round((10 * Math.random())).toFixed()}&nocache=${Math.random()}`,
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
    const { state: context } = useContext(Context);
    const [posts, setPosts] = React.useState<Post[]>([]);

    React.useEffect(() => {
        setPosts(generateMockPosts(5));
    }, []);

    // Infinite scrolling callback
    const handleInfiniteScroll = React.useCallback(() => {
        setPosts(posts.concat(generateMockPosts(10)));
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
                            <ShowPost post={post} key={post.id} />
                        )}
                    </section>
                </>}
        </>
    );
}

export default ViewFeed;
