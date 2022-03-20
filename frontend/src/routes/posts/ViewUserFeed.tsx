import React from 'react';
import { useParams } from 'react-router-dom';

import User from '../../models/User';
import PostBasicInfo from '../../models/PostBasicInfo';

import { ProfilePhoto } from '../accounts';
import PostGrid from './PostGrid';

import './ViewUserFeed.css';

const pluralHelper = (word: string, count: number | undefined) =>
    <><b>{count}</b> {`${word}${(count !== 1) ? 's' : ''}`}</>;

type LoadState = 'INIT' | 'LOADED' | 'ERROR';

interface UserFeedState {
    loadState: LoadState;
    userInfo?: User;
    posts?: PostBasicInfo[];
}

const ViewUserFeed: React.FC = () => {
    const { username } = useParams();

    const [state, setState] = React.useState<UserFeedState>({ loadState: 'INIT' });

    React.useEffect(() => {
        setState({ loadState: 'INIT' });

        if (!username?.includes('error'))
            setState({
                loadState: 'LOADED',
                userInfo: {
                    username: username || '',
                    profileURL: '',
                    profilePhotoURL: 'http://picsum.photos/512/512?nocache=1',
                    amFollowing: false,
                    numberFollowing: 100,
                    numberOfFollowers: 1,
                    numberOfPosts: 20,
                    realName: 'John Doe'
                },
                posts: [{
                    postID: 'testpost1',
                    photoURL: 'http://picsum.photos/512/512?nocache=2',
                    numberOfLikes: 2
                }, {
                    postID: 'testpost2',
                    photoURL: 'http://picsum.photos/512/512?nocache=3',
                    numberOfLikes: 238
                }, {
                    postID: 'testpost3',
                    photoURL: 'http://picsum.photos/512/512?nocache=4',
                    numberOfLikes: 38
                }]
            });
        else setState({ loadState: 'ERROR' });
    }, [username]);

    const { loadState, userInfo, posts } = state;

    return <>
        <section className="userfeed-profile-info">
            {userInfo && <ProfilePhoto {...userInfo} />}
            <div className="userfeed-info">
                {loadState === 'ERROR' && <p>Sorry, something went wrong...</p>}
                {userInfo && <>
                    <h1>{username} - <em>{userInfo.realName}</em></h1>
                    <ul className='userfeed-info-list'>
                        <li>{pluralHelper('follower', userInfo.numberOfFollowers)}</li>
                        <li><b>{userInfo.numberFollowing}</b> following</li>
                        <li>{pluralHelper('post', userInfo.numberOfPosts)}</li>
                    </ul></>}
            </div>
        </section>
        <hr />
        {posts && <PostGrid posts={posts} />}
    </>;
}

export default ViewUserFeed;
