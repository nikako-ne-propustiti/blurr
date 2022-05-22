/**
 * @author Aleksa Marković
 */
import React from 'react';
import {useParams, Link} from 'react-router-dom';

import {follow, accountInfo, userPosts} from '../../api/';

import {PostBasicInfo, User} from '../../models/';

import {ProfilePhoto} from '../accounts';
import PostGrid from './PostGrid';
import {Context} from '../../shared/Context';
import Button from '../../shared/Button';
import InfiniteScroll from '../../shared/InfiniteScroll';

import './ViewUserFeed.css';
import '../../shared/Button.css'

const pluralHelper = (word: string, count?: number) =>
    <><b>{count}</b> {`${word}${(count !== 1) ? 's' : ''}`}</>;

type LoadState = 'INIT' | 'LOADED' | 'ERROR' | 'NOUSER';

const ViewUserFeed: React.FC = () => {
    const {username} = useParams();
    const {state: context} = React.useContext(Context);
    const [loadState, setLoadState] = React.useState<LoadState>('INIT');
    const [userInfo, setUserInfo] = React.useState<User>();
    const [postsLeft, setPostsLeft] = React.useState<number>(0);
    const [lastPostIndex, setLastPostIndex] = React.useState<number>(0);
    const [posts, setPosts] = React.useState<PostBasicInfo[]>([]);

    const handleFollow = React.useCallback(async () => {
        if (userInfo && context.loggedIn && username !== context.currentUser) {
            const result = await follow(username || '');
            if (result.success) {
                setUserInfo({...userInfo, amFollowing: result.following});
            }
        }
    }, [userInfo?.amFollowing]);


    // Infinite scrolling callback
    const handleInfiniteScroll = React.useCallback(async () => {
        if (loadState == 'LOADED' && postsLeft) {
            const response = await userPosts(username || '', lastPostIndex);
            if (!response.success) {
                setLoadState('ERROR');
            } else {
                setPosts(response.posts);
                setPostsLeft(response.left);
                setLastPostIndex(lastPostIndex + response.posts.length);
            }

        }
    }, [posts]);

    React.useEffect(() => {
        setLoadState('INIT');
        (async (username: string) => {
            const response = await accountInfo(username);
            if (!response.success) {
                if (response.error == 'Requested resource does not exist.')
                    setLoadState('NOUSER');
                else
                    setLoadState('ERROR');
                return;
            }
            setUserInfo({
                ...response.account,
                username: username || ''
            });
            const postsResponse = await userPosts(username, 0);
            if (!postsResponse.success) {
                setLoadState('ERROR');
                return;
            }
            setLoadState('LOADED');
            setPosts(postsResponse.posts);
            setPostsLeft(postsResponse.left);
            setLastPostIndex(postsResponse.posts.length);
        })(username || '');

    }, [username]);

    return <>
        <section className="userfeed-profile-info">
            <InfiniteScroll callback={handleInfiniteScroll}/>
            {userInfo && <ProfilePhoto profilePhotoURL={userInfo.profilePhotoURL} tooltip={username}/>}
            <div className="userfeed-info">
                {loadState === 'ERROR' && <p>Sorry, something went wrong...</p>}
                {loadState === 'NOUSER' && <p>The requested user does not exist.</p>}
                {userInfo && <>
                    <h1>{username} - <em>{userInfo.realName}</em></h1>
                    <ul className='userfeed-info-list'>
                        <li>{pluralHelper('follower', userInfo.numberOfFollowers)}</li>
                        <li><b>{userInfo.numberFollowing}</b> following</li>
                        <li>{pluralHelper('post', userInfo.numberOfPosts)}</li>
                    </ul>
                </>}
            </div>
            {loadState == 'LOADED' && <div className='userfeed-buttons'>
                {context.loggedIn
                    && context.currentUser !== username
                    && <Button text={(userInfo?.amFollowing) ? 'Unfollow' : 'Follow'} onClick={handleFollow}/>}
                {context.currentUser === username
                    && <Link to="/accounts/edit" className="button">Edit account</Link>}
            </div>}
        </section>
        <hr/>
        {posts && <PostGrid posts={posts}/>}
    </>;
}

export default ViewUserFeed;
