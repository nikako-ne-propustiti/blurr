import React from 'react';
import PostPreview from './PostPreview';
import './PostGrid.css';

interface Props {
    username?: string
};

const PostGrid: React.FC<Props> = ({ username }) => {
    interface State {
        isLoading: boolean,
        isError: boolean,
        lastLoaded?: string,
        posts: string[]
    }

    type ACTIONTYPE =
        | { type: "fetch_init"; }
        | { type: "fetch_load"; posts: string[]; }
        | { type: "fetch_fail"; };

    const initialState: State = {
        isLoading: true,
        isError: false,
        posts: []
    };

    const PostGridReducer = (state: typeof initialState, action: ACTIONTYPE) => {
        switch (action.type) {
            case 'fetch_init':
                return {
                    ...state,
                    isLoading: true,
                    isError: false
                };
            case 'fetch_load':
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    posts: state.posts.concat(action.posts)
                };
            case 'fetch_fail':
                return {
                    ...state,
                    isError: true,
                    imageUrl: ''
                };
            default:
                throw new Error();
        }
    };

    const [state, dispatch] = React.useReducer(PostGridReducer, initialState);

    React.useEffect(() => {
        dispatch({
            type: 'fetch_init'
        });
        setTimeout(() => {
            if (username !== 'noacc')
                dispatch({
                    type: 'fetch_load',
                    posts: Array.from({ length: 5 }, () => Math.floor(Math.random() * 40).toString())
                });
            else
                dispatch({
                    type: 'fetch_fail'
                });
        }, 100 * Math.random());
    }, [username]);

    return <section className='post-grid'>
        {!state.isError && state.posts.map((post) =>
            <PostPreview photoId={post} key={post}></PostPreview>
        )}
    </section>
};

export default PostGrid;