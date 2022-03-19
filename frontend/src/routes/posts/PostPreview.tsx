import React from 'react';
import placeholder from '../../placeholder.jpg';

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
        imageUrl : 'loader.gif'
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
                    imageUrl: 'error.png'
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
                    imageUrl: placeholder
                });
            else 
            dispatch({
                type: 'fetch_fail'
            });
        }, 1000 * Math.random());
    }, [photoId]);

    return <div className='postPreview'>
        <img src={state.imageUrl} />
    </div>
};

export default PostPreview;