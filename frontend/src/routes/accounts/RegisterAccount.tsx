/**
 * @author Luka Simić
 */
import React, {FormEvent, useCallback, useContext, useState} from 'react';
import AccountTextInput from './AccountTextInput';
import logo from '../../logo.png';
import {Link, Navigate, useSearchParams} from 'react-router-dom';
import Button from '../../shared/Button';
import SubmissionIndicator, {SubmissionState} from '../../shared/SubmissionIndicator';
import {Context} from '../../shared/Context';
import {register} from '../../api';
import validateRedirectTarget from '../../utils/validateRedirectTarget';
import './RegisterAccount.css';

const RegisterAccount: React.FC = () => {
    const [submissionState, setSubmissionState] = useState<SubmissionState>('not-submitted');
    const [indicatorText, setIndicatorText] = useState('');
    const [searchParams] = useSearchParams();
    const {state, dispatch} = useContext(Context);
    const onRegisterSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name');
        const username = formData.get('username');
        const password = formData.get('password');
        const repeatPassword = formData.get('repeat-password');
        if (
            typeof username !== 'string' ||
            username.length === 0 ||
            typeof password !== 'string' ||
            password.length === 0 ||
            typeof name !== 'string' ||
            name.length === 0 ||
            typeof repeatPassword !== 'string'
        ) {
            setSubmissionState('error');
            setIndicatorText('Please fill in all the fields.');
            return;
        }
        if (password !== repeatPassword) {
            setSubmissionState('error');
            setIndicatorText('Passwords do not match.');
            return;
        }
        setSubmissionState('submitting');
        setIndicatorText('');
        const response = await register(username, password, name);
        if (response.success) {
            setSubmissionState('not-submitted');
            dispatch({
                type: 'log-in',
                username: username
            });
        } else {
            setSubmissionState('error');
            setIndicatorText(response.error);
        }
    }, []);
    const returnTo = validateRedirectTarget(searchParams.get('returnTo'));
    return <form action="/accounts/register" method="POST" className="login-form" onSubmit={onRegisterSubmit}>
        {state.loggedIn && <Navigate to={returnTo} />}
        <img src={logo} alt="Blurr logo" />
        <AccountTextInput name="username" placeholder="Username" length={30} />
        <AccountTextInput name="name" placeholder="Real name" length={255} />
        <AccountTextInput name="password" placeholder="Password" length={255} isPassword={true} />
        <AccountTextInput name="repeat-password" placeholder="Repeat password" length={255} isPassword={true} />
        <Button text="Register" />
        <SubmissionIndicator submissionState={submissionState} text={indicatorText} />
        <p>Already have an account? <strong><Link to={`/accounts/login?returnTo=${encodeURIComponent(returnTo)}`}>Log in</Link></strong></p>
    </form>;
}

export default RegisterAccount;
