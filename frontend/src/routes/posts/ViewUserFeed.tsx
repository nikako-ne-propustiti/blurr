import React, { SyntheticEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import User from '../../models/User';
import PostBasicInfo from '../../models/PostBasicInfo';

import { ProfilePhoto } from '../accounts';
import PostGrid from './PostGrid';
import { Context } from '../../shared/Context';
import Button from '../../shared/Button';
import InfiniteScroll from '../../shared/InfiniteScroll';

import './ViewUserFeed.css';

const mockUserInfo: User = {
    username: 'not loaded',
    profileURL: '',
    profilePhotoURL: 'http://picsum.photos/512/512',
    amFollowing: false,
    numberFollowing: 100,
    numberOfFollowers: 1,
    numberOfPosts: 20,
    realName: 'John Doe'
};

const generateMockPosts = ( number : number) => {
    return new Array(number).fill(null).map(() => {return {
        postID: Math.round((100000 * Math.random())).toFixed(),
        photoURL: `http://picsum.photos/512/512?blur=${Math.round((10 * Math.random())).toFixed()}&nocache=${Math.random()}`,
        numberOfLikes: Math.round((100 * Math.random()))
    }});
}

const pluralHelper = (word: string, count: number | undefined) =>
    <><b>{count}</b> {`${word}${(count !== 1) ? 's' : ''}`}</>;

type LoadState = 'INIT' | 'LOADED' | 'ERROR' | 'NOUSER';

const ViewUserFeed: React.FC = () => {
    const { username } = useParams();
    const { state: context } = React.useContext(Context);
    const navigate = useNavigate();
    const [loadState, setLoadState] = React.useState<LoadState>('INIT');
    const [userInfo, setUserInfo] = React.useState<User>();
    const [posts, setPosts] = React.useState<PostBasicInfo[]>([]);

    const handleFollow = () => {
        if (userInfo && context.loggedIn && username !== context.currentUser) {
            if (userInfo.amFollowing)
                setUserInfo({ ...userInfo, amFollowing: false });
            else setUserInfo({ ...userInfo, amFollowing: true });
        }
        // TODO API call...
    };

    // Edit account button
    const handleEditAccount = () => {
        navigate('/accounts/edit');
    };

    // Infinite scrolling callback
    const handleInfiniteScroll = () => {
        setPosts(posts.concat(generateMockPosts(10)));
    };

    React.useEffect(() => {
        setLoadState('INIT');

        // TODO API call...
        if (username?.includes('error'))
            setLoadState('ERROR');
        else if (username?.includes('noacc'))
            setLoadState('NOUSER');
        else {
            setUserInfo({
                ...mockUserInfo,
                username: username || ''
            });
            setPosts(generateMockPosts(10));
        }
    }, [username]);

    return <>
        <section className="userfeed-profile-info">
            <InfiniteScroll callback={handleInfiniteScroll} />
            {userInfo && <ProfilePhoto user={userInfo} isMyProfile={context.currentUser === username} />}
            <div className="userfeed-info">
                {loadState === 'ERROR' && <p>Sorry, something went wrong...</p>}
                {loadState === 'NOUSER' && <p>The requested user does not exist.</p>}
                {userInfo && <>
                    <h1>{username} - <em>{userInfo.realName}</em></h1>
                    <ul className='userfeed-info-list'>
                        <li>{pluralHelper('follower', userInfo.numberOfFollowers)}</li>
                        <li><b>{userInfo.numberFollowing}</b> following</li>
                        <li>{pluralHelper('post', userInfo.numberOfPosts)}</li>
                    </ul></>}
            </div>
            <div className='userfeed-buttons'>
                {context.loggedIn
                    && context.currentUser !== username
                    && <Button text={(userInfo?.amFollowing) ? 'Unfollow' : 'Follow'} onClick={handleFollow} />}
                {context.currentUser === username
                    && <Button text='Edit account' onClick={handleEditAccount} />}
            </div>
        </section>
        <hr />
        {posts && <PostGrid posts={posts} />}
    </>;
}

export default ViewUserFeed;
