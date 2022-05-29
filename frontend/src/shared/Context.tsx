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
            return {
                ...state,
                loggedIn: Boolean(action.username),
                currentUser: action.username
            };
        case 'log-out':
            return {
                ...state,
                loggedIn: false,
                currentUser: ''
            };
    }
};

const initialState: State = {
    loggedIn: false
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
