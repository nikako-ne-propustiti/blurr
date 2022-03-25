import React from 'react';
import {CreateComment, ShowComment} from './comments';
import {Post} from '../../models';
import Icon from '../../shared/Icon';

import './ShowPost.css';

interface Props {
    post: Post;
    showComments?: boolean;
}

const imageDoubleClick = () => {
    console.log('Double click');
};

const ShowPost: React.FC<Props> = ({post, showComments}) => {
    return (
        <article className="wrapper">
            <img onDoubleClick={imageDoubleClick} src={post.photoURL} />
            <div className="panel">
                <div className="profile-bar">
                    <a href={post.poster.profileURL}>
                        <img src={post.poster.profilePhotoURL}></img>
                    </a>
                    <a href={post.poster.profileURL}>
                        {post.poster.username}
                    </a>
                    <span className="dot-separator">•</span>
                    <span> 
                        {post.poster.amFollowing ? "Following" : "Not following"}
                    </span>
                </div>

                {showComments && <div className="comments">
                    <ul>
                    {post.comments.map(c => <ShowComment comment={c} />)}
                    </ul>
                </div>}

                {showComments && <div className="post-bottom">
                    <Icon name={post.haveLiked ? 'favorite' : 'favorite_border'} />
                    <input type="text" className="key-box" placeholder="Enter the key" />
                    <div>
                        Liked by stan, elizabeth, and 39 others
                    </div>
                </div>}

                {showComments && <CreateComment />}

            </div>
        </article>
    );
}

export default ShowPost;
