/**
 * @author Luka Simić
 */
import React, { FormEvent, useCallback, useContext, useState } from 'react';
import AccountTextInput from './AccountTextInput';
import logo from '../../logo.png';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import Button from '../../shared/Button';
import './Login.css';
import SubmissionIndicator, { SubmissionState } from '../../shared/SubmissionIndicator';
import { Context } from '../../shared/Context';
import { login } from '../../api';
import validateRedirectTarget from '../../utils/validateRedirectTarget';

const Login: React.FC = () => {
    const [submissionState, setSubmissionState] = useState<SubmissionState>('not-submitted');
    const [indicatorText, setIndicatorText] = useState('');
    const [searchParams] = useSearchParams();
    const { state, dispatch } = useContext(Context);
    const onLoginSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get('username');
        const password = formData.get('password');
        if (typeof username !== 'string' || typeof password !== 'string') {
            setSubmissionState('error');
            setIndicatorText('Please provide a username and a password.');
            return;
        }
        setSubmissionState('submitting');
        setIndicatorText('');
        const response = await login(username, password);
        if (response.success) {
            setSubmissionState('not-submitted');
            dispatch({
                type: 'log-in',
                username: username,
                isAdmin: response.isAdmin
            });
        } else {
            setSubmissionState('error');
            setIndicatorText(response.error);
        }
    }, []);
    const returnTo = validateRedirectTarget(searchParams.get('returnTo'));
    return <form action="/accounts/login" method="POST" className="login-form" onSubmit={onLoginSubmit}>
        {state.loggedIn && <Navigate to={returnTo} />}
        <img src={logo} alt="Blurr logo" />
        <AccountTextInput name="username" placeholder="Username" length={30} />
        <AccountTextInput name="password" placeholder="Password" length={255} isPassword={true} />
        <Button text="Login" />
        <SubmissionIndicator submissionState={submissionState} text={indicatorText} />
        <p>No account? <strong><Link to={`/accounts/register?returnTo=${encodeURIComponent(returnTo)}`}>Register</Link></strong></p>
    </form>;
}

export default Login;
