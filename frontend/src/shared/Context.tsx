import React from 'react';

interface State {
    loggedIn: boolean
    currentUser?: string
}

export interface Action {
    type: 'log-in' | 'log-out',
    username?: string
}

type ContextReducer = (state: State, action: Action) => State;

const reducer: ContextReducer = (state, action) => {
    switch (action.type) {
        case 'log-in':
            // TODO: Remove after the prototype
            localStorage.setItem('logged-in', 'true');
            localStorage.setItem('currentUser', action.username || '');
            return {
                ...state,
                loggedIn: true,
                currentUser: action.username
            };
        case 'log-out':
            localStorage.setItem('logged-in', 'false');
            localStorage.setItem('currentUser', '');
            return {
                ...state,
                loggedIn: false,
                currentUser: ''
            };
    }
};

const initialState: State = {
    // TODO: Change after the prototype
    loggedIn: Boolean(localStorage.getItem('logged-in')),
    currentUser: localStorage.getItem('currentUser') || undefined
};

export const Context = React.createContext({
    state: initialState,
    dispatch: (_: Action) => { }
});

interface Props {
    children: React.ReactNode
}

export const ContextProvider: React.FC<Props> = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return <Context.Provider value={{ state, dispatch }}>
        {children}
    </Context.Provider>
};
