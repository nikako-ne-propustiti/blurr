import React from 'react';
import { Link } from 'react-router-dom';

import {Post} from "../../models";

import './PostPreview.css';

// Square preview of a post, as it appears on the user's page
const PostPreview: React.FC<Post> = ({ url, photoURL, likes }) => {
    return <Link to={`/p/${url}`} className='post-preview'>
        <img className="post-preview-image" src={`${BACKEND_API_URL}/${photoURL}`} />
        <div className="post-preview-overlay">
            <div className="post-preview-bar">❤️ {likes}</div>
        </div>
    </Link>
};

export default PostPreview;
