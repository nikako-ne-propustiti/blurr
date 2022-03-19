import React from 'react';

interface Props {
    username?: string
};

const ProfilePhotoChanger: React.FC<Props> = ({ username }) => {
    type ACTIONTYPE =
        | { type: "fetch_init"; }
        | { type: "fetch_success"; imageUrl: string; canUpload: boolean; }
        | { type: "fetch_fail"; };

    const initialState = {
        imageUrl: 'loader.gif',
        tooltipText: 'Loading...',
        isLoading: true,
        isError: false,
        canUpload: false,
        newImageUrl: ''
    };

    const profilePhotoReducer = (state: typeof initialState, action: ACTIONTYPE) => {
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
                    imageUrl: action.imageUrl,
                    canUpload: action.canUpload,
                    tooltipText: (action.canUpload) ? 'Click here to upload a new profile photo' : `${username}'s profile photo`
                };
            case 'fetch_fail':
                return {
                    ...state,
                    isError: true,
                    imageUrl: 'error.png',
                    tooltipText : 'Error loading profile photo'
                };
            default:
                throw new Error();
        }
    };

    const [state, dispatch] = React.useReducer(profilePhotoReducer, initialState);

    React.useEffect(() => {
        dispatch({
            type: 'fetch_init'
        });
        setTimeout(() => {
            if (username !== 'noaccount')
                dispatch({
                    type: 'fetch_success',
                    imageUrl: 'logo.png',
                    canUpload: false
                });
            else 
            dispatch({
                type: 'fetch_fail'
            });
        }, 1000);
    }, [username]);


    return <img src={state.imageUrl} title={state.tooltipText} />
};

export default ProfilePhotoChanger;