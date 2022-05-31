/**
 * @author Ivan Pešić
 */
import React, { useCallback, useContext, useState, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import Button from '../../shared/Button';
import { Context } from '../../shared/Context';
import { createPost } from '../../api';

import './CreatePost.css';
import SubmissionIndicator, { SubmissionState } from '../../shared/SubmissionIndicator';

const CreatePost: React.FC = () => {
    const fileInputRef = React.createRef<HTMLInputElement>();
    const { state } = useContext(Context);
    const [blurLevel, setBlurLevel] = useState(20);
    const [fileUrl, setFileUrl] = useState('');
    const [password, setPassword] = useState('');
    const [postId, setPostId] = useState('');
    const [indicatorText, setIndicatorText] = useState('');
    const [submissionState, setSubmissionState] = useState<SubmissionState>('not-submitted');
    const showFilePreview = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files;
        if (!files || files.length === 0) {
            setFileUrl('');
            return;
        }
        setFileUrl(URL.createObjectURL(files[0]));
    }, []);
    const delegateUpload = useCallback(() => fileInputRef.current?.click(), [fileInputRef]);
    const updateBlurLevel = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setBlurLevel(Number(event.currentTarget.value)), []);
    const updatePassword = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.currentTarget.value), []);
    const imageLoadCleanup = useCallback(() => fileUrl !== '' && URL.revokeObjectURL(fileUrl), [fileUrl]);
    const formRef = React.useRef<HTMLFormElement>(null);
    const onCreatePostSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formRef.current) return;

        const formData = new FormData(formRef.current);
        setSubmissionState('submitting');
        const response = await createPost(formData);

        if (response.success) {
            setPostId(response.url);
        } else {
            setSubmissionState('error');
            setIndicatorText(response.error);
        }
    }, []);
    return <form action="/p/new" method="POST" className="create-post" onSubmit={onCreatePostSubmit} encType="multipart/form-data" ref={formRef}>
        {!state.loggedIn && <Navigate to="/accounts/login?returnTo=%2Fp%2Fnew" />}
        {postId && <Navigate to={`/p/${postId}`} />}
        <fieldset className="create-post-image-info">
            {
                fileUrl ?
                    <img src={fileUrl} alt="Uploaded image" onClick={delegateUpload} onLoad={imageLoadCleanup} style={{ filter: `blur(${blurLevel}px)` }} /> :
                    <p onClick={delegateUpload}>Click to upload an image</p>
            }
            <input type="file" name="image" accept="image/*" onChange={showFilePreview} ref={fileInputRef} />
        </fieldset>
        <fieldset className="create-post-contents">
            <p>Blur level: <input type="range" className="create-post-blur-level" min="5" max="20" name="blur-level" onChange={updateBlurLevel} /> {blurLevel}</p>
            <p>Description: <textarea name="description" rows={10}></textarea></p>
            <p><input type="password" className="create-post-password" name="password" placeholder="Enter the image password" onChange={updatePassword} maxLength={30} /></p>
            <Button text="Submit" disabled={fileUrl === '' || password === ''} />
            <SubmissionIndicator submissionState={submissionState} text={indicatorText} />
        </fieldset>
    </form>;
}

export default CreatePost;
