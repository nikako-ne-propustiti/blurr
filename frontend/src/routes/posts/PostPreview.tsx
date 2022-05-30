import React from 'react';
import {Link} from 'react-router-dom';
import {Post} from '../../models';
import {BACKEND_API_URL} from '../../api';

import './PostPreview.css';
import Icon from "../../shared/Icon";

// Square preview of a post, as it appears on the user's page
const PostPreview: React.FC<Post> = ({url, photoURL, likes, haveLiked, comments}) => {

    return <Link to={`/p/${url}`} className='post-preview'>
        <img className="post-preview-image" src={`${BACKEND_API_URL}/${photoURL}`}/>
        <div className="post-preview-overlay">
            <div className="post-preview-bar">
                <Icon name={haveLiked ? 'favorite' : 'favorite_border'}/>️ {likes}
                <Icon name='comment'/>️ {comments.length}
            </div>
        </div>
    </Link>
};

export default PostPreview;
