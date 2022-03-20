import React from 'react';
import { Link } from 'react-router-dom';
import './PostPreview.css';
import Post from '../../models/Post';


// Square preview of a post, as it appears on the user's page
const PostPreview: React.FC<Post> = ({ postID, photoURL }) => {
    return <Link to={`/p/${postID}`} className='post-preview'>
        <img className="post-preview-image" src={photoURL} />
    </Link>
};

export default PostPreview;