import React from 'react';
import {Post} from '../../models';
import Icon from '../../shared/Icon';
import {ShowPost} from '../posts';

import './PostReview.css';

interface Props {
    callback: (post: Post, approve: boolean) => void,
    post: Post;
}

const PostReview: React.FC<Props> = ({callback, post}) => {
    return <div className="review-feed-post">
        <div className="review-feed-post-buttons">
            <button onClick={() => callback(post, true)}><Icon name="done" /></button>
            <button onClick={() => callback(post, false)}><Icon name="clear" /></button>
        </div>
        <ShowPost post={post} />
    </div>
};

export default PostReview;
