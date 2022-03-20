import React from 'react';
import { useParams } from 'react-router-dom';

import User from '../../models/User';
import Post from '../../models/Post';

import { ProfilePhoto } from '../accounts';
import PostGrid from './PostGrid';

import './ViewUserFeed.css';

const pluralHelper = (word: string, count: number | undefined) =>
    <><b>{count}</b> {`${word}${(count !== 1) ? 's' : ''}`}</>;

type LoadState = 'INIT' | 'LOADED' | 'ERROR';

interface UserFeedState {
    loadState: LoadState;
    userInfo?: User;
    posts?: Post[];
}

const ViewUserFeed: React.FC = () => {
    const { username } = useParams();

    const [state, setState] = React.useState<UserFeedState>({ loadState: 'INIT' });

    React.useEffect(() => {
        setState({ loadState: 'ERROR' });
    }, [username]);

    const { loadState, userInfo, posts } = state;

    return <>
        <section className="userfeed-profile-info">
            {userInfo && <ProfilePhoto {...userInfo} />}
            <div className="userfeed-info">
                {loadState === 'ERROR' && <p>Sorry, something went wrong...</p>}
                {userInfo && <ul>
                    <li>Data 1.</li>
                    <li>Data 2.</li>
                    <li>Data 3.</li>
                </ul>}
            </div>
        </section>
        <hr />
        {posts && <PostGrid posts={posts} />}
    </>;
}

export default ViewUserFeed;
