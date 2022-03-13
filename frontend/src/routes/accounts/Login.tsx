import React, {FormEvent, useCallback, useContext, useState} from 'react';
import AccountTextInput from './AccountTextInput';
import logo from '../../logo.png';
import {Link, Navigate} from 'react-router-dom';
import Button from '../../shared/Button';
import './Login.css';
import SubmissionIndicator, {SubmissionState} from '../../shared/SubmissionIndicator';
import {Context} from '../../shared/Context';

const Login: React.FC = () => {
    const [submissionState, setSubmissionState] = useState<SubmissionState>('not-submitted');
    const [indicatorText, setIndicatorText] = useState('');
    const {state, dispatch} = useContext(Context);
    const onLoginSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get('username');
        const password = formData.get('password');
        setSubmissionState('submitting');
        setIndicatorText('');
        // Prototype data.
        if (username === 'admin' && password === 'admin') {
            setSubmissionState('not-submitted');
            dispatch({
                type: 'log-in'
            });
        } else {
            setSubmissionState('error');
            setIndicatorText('Invalid username or password.');
        }
    }, [submissionState, indicatorText]);
    return <form action="/accounts/login" method="POST" className="login-form" onSubmit={onLoginSubmit}>
        {state.loggedIn && <Navigate to="/" />}
        <img src={logo} alt="Blurr logo" />
        <AccountTextInput name="username" placeholder="Username" />
        <AccountTextInput name="password" placeholder="Password" />
        <Button text="Login" />
        <SubmissionIndicator submissionState={submissionState} text={indicatorText} />
        <p>No account? <strong><Link to='/accounts/register'>Register</Link></strong></p>
    </form>;
}

export default Login;
