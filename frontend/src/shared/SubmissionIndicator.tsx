import React from 'react';
import './SubmissionIndicator.css';
import loader from '../loader.gif';

export type SubmissionState = 'not-submitted' | 'submitting' | 'error';

interface Props {
    submissionState: SubmissionState,
    text?: string
}

const SubmissionIndicator: React.FC<Props> = ({submissionState, text}) => {
    return (
        <p className={`indicator-${submissionState}`}>
            {submissionState === 'submitting' && <img src={loader} alt="Loading..." />}
            {text}
        </p>
    );
}

export default SubmissionIndicator;
