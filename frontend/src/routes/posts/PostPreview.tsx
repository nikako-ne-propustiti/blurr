import React from 'react';
import { Link } from 'react-router-dom';

import {Post} from "../../models";

import './PostPreview.css';

// Square preview of a post, as it appears on the user's page
// TODO Hover overlay with no. of likes
const PostPreview: React.FC<Post> = ({ id, photoURL, likes }) => {
    return <Link to={`/p/${id}`} className='post-preview'>
        <img className="post-preview-image" src={photoURL} />
        <div className="post-preview-overlay">
            <div className="post-preview-bar">❤️ {likes}</div>
        </div>
    </Link>
};

export default PostPreview;
