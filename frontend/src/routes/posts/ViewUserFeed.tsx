import React from 'react';
import { useParams } from 'react-router-dom';
import PostGrid from './PostGrid';
import { ProfilePhoto } from '../accounts';
import './ViewUserFeed.css';

const pluralHelper = (word: string, count: number | undefined) =>
    <><b>{count}</b> {`${word}${(count !== 1) ? 's' : ''}`}</>;

const ViewUserFeed: React.FC = () => {
    interface UserData {
        name: string,
        postsCount: number
        followersCount: number,
        followingCount: number,
    };

    interface State {
        isLoading: boolean,
        isError: boolean,
        userData?: UserData
    }

    type ACTIONTYPE =
        | { type: "fetch_init"; }
        | { type: "fetch_success"; userData: UserData; }
        | { type: "fetch_fail"; };

    const initialState: State = {
        isLoading: true,
        isError: false,
    };

    const UserFeedReducer = (state: typeof initialState, action: ACTIONTYPE) => {
        switch (action.type) {
            case 'fetch_init':
                return {
                    ...state,
                    isLoading: true,
                    isError: false
                };
            case 'fetch_success':
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    userData: action.userData
                };
            case 'fetch_fail':
                return {
                    ...state,
                    isError: true,
                };
            default:
                throw new Error();
        }
    };

    const [state, dispatch] = React.useReducer(UserFeedReducer, initialState);

    const { username } = useParams();

    React.useEffect(() => {
        dispatch({
            type: 'fetch_init'
        });
        setTimeout(() => {
            if (username !== 'noacc')
                dispatch({
                    type: 'fetch_success',
                    userData: {
                        name: 'Miljan Marković',
                        postsCount: 12,
                        followersCount: 213481,
                        followingCount: 1,
                    }
                });
            else
                dispatch({
                    type: 'fetch_fail'
                });
        }, 1000 * Math.random());
    }, [username]);


    return (
        <>
            <section className="userfeed-profile-info">
                <ProfilePhoto username={username}></ProfilePhoto>
                <div className="userfeed-info">
                    {state.isError
                        ? <p>Error loading profile.</p>
                        : (state.isLoading ? <p>Loading...</p> :
                            <>
                                <h1>{username} - <em>{state.userData?.name}</em></h1>
                                <p>
                                    {pluralHelper('follower', state.userData?.followersCount)}.&nbsp;
                                    <b>{state.userData?.followingCount}</b> following.&nbsp;
                                    {pluralHelper('post', state.userData?.postsCount)}.&nbsp;
                                </p>
                            </>
                        )}
                </div>
            </section>
            <hr />
            <PostGrid username={username}></PostGrid>
        </>
    );
}

export default ViewUserFeed;
