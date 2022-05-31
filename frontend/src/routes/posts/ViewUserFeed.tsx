/**
 * @author Aleksa Marković
 */
import React from 'react';
import {useParams, Link} from 'react-router-dom';

import {follow, accountInfo, posts as getPosts} from '../../api/';

import {Post, User} from '../../models/';

import ProfilePhoto from '../../shared/ProfilePhoto';
import PostGrid from './PostGrid';
import {Context} from '../../shared/Context';
import Button from '../../shared/Button';
import InfiniteScroll from '../../shared/InfiniteScroll';

import './ViewUserFeed.css';
import '../../shared/Button.css'
import SubmissionIndicator, {SubmissionState} from "../../shared/SubmissionIndicator";

const pluralHelper = (word: string, count?: number) =>
    <><b>{count}</b> {`${word}${(count !== 1) ? 's' : ''}`}</>;

type LoadState = 'INIT' | 'LOADED' | 'ERROR' | 'NOUSER';

const ViewUserFeed: React.FC = () => {
    const {username} = useParams();
    const {state: context} = React.useContext(Context);
    const [loadState, setLoadState] = React.useState<LoadState>('INIT');
    const [userInfo, setUserInfo] = React.useState<User>();
    const [lastPostIndex, setLastPostIndex] = React.useState<number>(0);
    const [posts, setPosts] = React.useState<Post[]>([]);
    const [loaderState, setLoaderState] = React.useState<SubmissionState>("not-submitted");

    const handleFollow = React.useCallback(async () => {
        if (userInfo && context.loggedIn && username !== context.currentUser) {
            const result = await follow(username || '');
            if (result.success) {
                setUserInfo({
                    ...userInfo,
                    amFollowing: result.following,
                    numberOfFollowers: result.following ?
                        userInfo.numberOfFollowers + 1 :
                        userInfo.numberOfFollowers - 1
                });
            }
        }
    }, [userInfo?.amFollowing]);

    // Infinite scrolling callback
    const handleInfiniteScroll = React.useCallback(async () => {
        if (loadState !== 'LOADED') {
            return;
        }
        setLoaderState('submitting');
        const response = await getPosts(lastPostIndex, username || '');
        if (!response.success) {
            setLoadState('ERROR');
        } else {
            setPosts(posts.concat(response.posts));
            setLastPostIndex(lastPostIndex + response.posts.length);
        }
        setLoaderState('not-submitted');
    }, [loadState, setLoadState, posts, setPosts, lastPostIndex, setLastPostIndex]);

    React.useEffect(() => {
        setLoadState('INIT');
        setLoaderState('submitting');
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
            const postsResponse = await getPosts(0, username || '');
            if (!postsResponse.success) {
                setLoadState('ERROR');
                return;
            }
            setPosts(postsResponse.posts);
            setLastPostIndex(postsResponse.posts.length);
            setLoadState('LOADED');
            setLoaderState('not-submitted');
        })(username || '');

    }, [username, setUserInfo, setLoadState, setPosts, setLastPostIndex]);

    return <>
        <section className="userfeed-profile-info">
            <InfiniteScroll callback={handleInfiniteScroll}/>
            {userInfo && <ProfilePhoto userInfo={userInfo} setUserInfo={setUserInfo} />}
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
        <SubmissionIndicator submissionState={loaderState}/>
    </>;
}

export default ViewUserFeed;
