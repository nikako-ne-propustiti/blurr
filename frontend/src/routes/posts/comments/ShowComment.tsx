import React from 'react';
import {Comment} from '../../../models';
import Icon from '../../../shared/Icon';

import './ShowComment.css';

interface Props {
    comment: Comment;
}

const ShowComment: React.FC<Props> = ({comment: {id, commenter, text, likes, haveLiked}}) => {
    return <li key={id} className="comment">
        <img src={commenter.profilePhotoURL} />
        <div className="comm">
            <div className="comm-top">
                <a href={commenter.profileURL}>{commenter.username}</a>
                {text}
            </div>
            <div className="comm-bottom">
                <span>1 minute ago</span>

                {likes > 0 && <span>{`${likes} ${likes === 1 ? 'like' : 'likes'}`}</span>}
                
                <button>Reply</button>
            </div>
        </div>

        <Icon name={haveLiked ? 'favorite' : 'favorite_border'} />

    </li>
};

export default ShowComment;
