/**
 * @author Luka Simić
 */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Post} from '../../models';
import SubmissionIndicator, {SubmissionState} from '../../shared/SubmissionIndicator';
import PostReview from './PostReview';
import {getReview, submitReview} from '../../api';
import {Navigate} from 'react-router-dom';
import {Context} from '../../shared/Context';

import './Review.css';

const Review: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingState, setLoadingState] = useState<SubmissionState>('submitting');
    const [errorReason, setErrorReason] = useState('');
    const {state} = useContext(Context);
    useEffect(() => {
        let mounted = true;
        (async () => {
            const response = await getReview();
            if (!mounted) {
                return;
            }
            if (!response.success) {
                setLoadingState('error');
                setErrorReason(response.error);
                return;
            }
            setLoadingState('not-submitted');
            setPosts(response.posts);
        })();
        return () => {mounted = false};
    }, []);
    const submitCallback = useCallback(async (post: Post, approve: boolean) => {
        const response = await submitReview(post.id, approve);
        if (!response.success) {
            // TODO: Error reporting
            return;
        }
        setPosts(posts.filter(p => p.id !== post.id));
    }, [posts]);
    return <div className="review-feed">
        {state.loggedIn || <Navigate to="/accounts/login" />}
        {state.currentUser === 'admin' || <Navigate to="/" />}
        <SubmissionIndicator submissionState={loadingState} text={errorReason} />
        {posts.map(p => <PostReview post={p} key={p.id} callback={submitCallback} />)}
    </div>;
}

export default Review;
