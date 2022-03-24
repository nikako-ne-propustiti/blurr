import React from 'react';
import { Link } from 'react-router-dom';

import PostBasicInfo from '../../models/PostBasicInfo';

import './PostPreview.css';

// Square preview of a post, as it appears on the user's page
// TODO Hover overlay with no. of likes
const PostPreview: React.FC<PostBasicInfo> = ({ id, photoURL, numberOfLikes }) => {
    return <Link to={`/p/${id}`} className='post-preview'>
        <img className="post-preview-image" src={photoURL} />
        <div className="post-preview-overlay">
            <div className="post-preview-bar">❤️ {numberOfLikes}</div>
        </div>
    </Link>
};

export default PostPreview;
