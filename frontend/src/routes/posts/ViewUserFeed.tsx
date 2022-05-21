/**
 * @author Aleksa Marković
 */
import React from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {follow, accountInfo, userPosts} from '../../api/';

import User from '../../models/User';
import PostBasicInfo from '../../models/PostBasicInfo';

import {ProfilePhoto} from '../accounts';
import PostGrid from './PostGrid';
import {Context} from '../../shared/Context';
import Button from '../../shared/Button';
import InfiniteScroll from '../../shared/InfiniteScroll';

import './ViewUserFeed.css';
import '../../shared/Button.css'
import accountinfo from "../../api/accountinfo";
import post from "../../models/Post";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;

const generateMockPosts = (number: number) => {
    return new Array(number).fill(null).map(() => {
        let photoURL = '';
        if (Math.floor(Math.random() * 10) === 0) {
            photoURL = `https://picsum.photos/512/512?nocache=${Math.random()}`;
        } else {
            photoURL = `https://picsum.photos/512/512?blur=${Math.round((10 * Math.random())).toFixed()}&nocache=${Math.random()}`;
        }
        return {
            id: Math.round((100000 * Math.random())).toFixed(),
            photoURL,
            numberOfLikes: Math.round((100 * Math.random()))
        }
    });
}

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
        if (loadState === 'LOADED' && userInfo && context.loggedIn && username !== context.currentUser) {
            const result = await follow(username || '');
            if (result.success) {
                setUserInfo({...userInfo, amFollowing: result.following});
            }
        }
    }, [userInfo?.amFollowing]);


    // Infinite scrolling callback
    const handleInfiniteScroll = React.useCallback(async() => {
        if (loadState == 'LOADED' && postsLeft){
            const response = await userPosts(username || '', lastPostIndex);
            if (!response.success){
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
            } else {
                setPosts(postsResponse.posts);
                setPostsLeft(postsResponse.left);
                setLastPostIndex(postsResponse.posts.length);
                setLoadState('LOADED');
            }
        })(username || '');
    }, [username]);

    return <>
        <section className="userfeed-profile-info">
            <InfiniteScroll callback={handleInfiniteScroll}/>
            {userInfo && <ProfilePhoto user={userInfo} isMyProfile={context.currentUser === username}/>}
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
