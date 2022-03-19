import React from 'react';
import placeholder from '../../placeholder.jpg';
import loader from '../../loader.gif';
import './PostPreview.css';

interface Props {
    photoId? : string
};

const PostPreview : React.FC<Props> = ({photoId}) => {
    type ACTIONTYPE =
    | { type: "fetch_init"; }
    | { type: "fetch_success"; imageUrl: string; }
    | { type: "fetch_fail"; };

    const initialState = {
        isLoading : true,
        isError : false,
        imageUrl : loader
    };

    const PostPreviewReducer = (state: typeof initialState, action: ACTIONTYPE) => {
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
                    imageUrl : action.imageUrl
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

    const [state, dispatch] = React.useReducer(PostPreviewReducer, initialState);

    React.useEffect(() => {
        dispatch({
            type: 'fetch_init'
        });
        setTimeout(() => {
            if (photoId !== 'nophoto')
                dispatch({
                    type: 'fetch_success',
                    imageUrl: `https://picsum.photos/512/512/?blur=${(Math.random()*10).toFixed()}&nocache=${Math.random()}`
                });
            else 
            dispatch({
                type: 'fetch_fail'
            });
        }, 1000 * Math.random());
    }, [photoId]);

    const openPostPage = () => {
        if (state.isError || state.isLoading) return;
        window.open(`/p/${state.imageUrl}`,'_blank');
    };

    return <div className='post-preview'>
        <img className="post-preview-image" src={state.imageUrl} onClick={openPostPage} />
    </div>
};

export default PostPreview;