import React, {useContext, useEffect, useState, FC, useCallback} from 'react';
import {Navigate} from 'react-router-dom';
import {User} from '../../models';
import Button from '../../shared/Button';
import {Context} from '../../shared/Context';
import ProfilePhoto from '../../shared/ProfilePhoto';
import SubmissionIndicator, {SubmissionState} from '../../shared/SubmissionIndicator';
import {accountInfo, editAccount} from '../../api';

import './EditAccount.css';

const EditAccount: FC = () => {
    const {state: context} = useContext(Context);
    const [submissionState, setSubmissionState] = useState<SubmissionState>('submitting');
    const [indicatorText, setIndicatorText] = useState('');
    const [userInfo, setUserInfo] = useState<User>();

    useEffect(() => {
        (async () => {
            if (!context.currentUser) {
                return;
            }
            const response = await accountInfo(context.currentUser);
            if (response.success) {
                setUserInfo({
                    ...response.account,
                    username: context.currentUser
                });
                setSubmissionState('not-submitted');
                setIndicatorText('');
            } else {
                setSubmissionState('error');
                setIndicatorText(response.error);
            }
        })();
    }, [context]);

    const handleSave = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmissionState('submitting');
        const formData = new FormData(event.currentTarget);
        const realName = formData.get('real-name');
        if (typeof realName !== 'string') {
            return;
        }
        const response = await editAccount(realName);
        if (response.success) {
            setSubmissionState('not-submitted');
            setIndicatorText('');
        } else {
            setSubmissionState('error');
            setIndicatorText(response.error);
        }
    }, [context]);

    return <div className="edit-account-wrapper">
        {!context.loggedIn && <Navigate to="/accounts/login?returnTo=%2Faccounts%2Fedit" />}
        <h1>Edit account</h1>
        <SubmissionIndicator submissionState={submissionState} text={indicatorText} />
        {userInfo && <form className="edit-account-form" onSubmit={handleSave}>
            <section>
                <label htmlFor="real-name">Real name:</label>
                <input type="text" name="real-name" id="real-name" defaultValue={userInfo.realName}></input>
                <Button text="Save" />
            </section>
            <section>
                <label htmlFor="profilePhotoFile">Profile photo:</label>
                <ProfilePhoto userInfo={userInfo} setUserInfo={setUserInfo} />
            </section>
        </form>}
    </div>;
}

export default EditAccount;
