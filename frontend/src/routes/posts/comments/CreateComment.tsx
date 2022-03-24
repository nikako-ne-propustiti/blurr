import React, { useCallback, useState } from 'react';

import './CreateComment.css';

const CreateComment: React.FC = () => {

    const [input, setInput] = useState('');

    const inputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }, []);

    return (
        <div className="comment-wrapper">
            <input onChange={inputChange} type="text" className="comment-box" placeholder="Add a comment" />
            <button className={`comment-btn ${input ? 'comment-btn-enabled' : ''}`}>post</button>
        </div>
    );
}

export default CreateComment;