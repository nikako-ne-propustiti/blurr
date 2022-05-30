import React, {useCallback} from 'react';
import {Comment} from '../../../models';
import Icon from '../../../shared/Icon';
import {Link} from 'react-router-dom';
import {BACKEND_API_URL} from '../../../api';

import './ShowComment.css';

interface Props {
    comment: Comment;
    onReply?: (user: string, parentCommentId: number) => void;
    onLike?: (comment: Comment) => void;
}

const ShowComment: React.FC<Props> = ({comment, onReply, onLike}) => {
    const {id, commenter, text, likes, haveLiked} = comment;

    const onReplyClick = useCallback(() => {
        if (onReply) {
            onReply(commenter.username, id);
        }
    }, [commenter, onReply]);

    const onLikeClick = useCallback(() => {
        if (onLike) {
            onLike(comment);
        }
    }, [comment, onLike]);

    return <li key={id} className="comment">
        <img src={`${BACKEND_API_URL}/${commenter.profilePhotoURL}`} />
        <div className="comm">
            <div className="comm-top">
                <Link to={`/${commenter.username}`}>{commenter.username}</Link>
                {text}
            </div>
            <div className="comm-bottom">
                <span>1 minute ago</span>

                {likes > 0 && <span>{`${likes} ${likes === 1 ? 'like' : 'likes'}`}</span>}
                
                {onReply && <button onClick={onReplyClick}>Reply</button>}
            </div>
        </div>

        {onLike && <button onClick={onLikeClick}><Icon name={haveLiked ? 'favorite' : 'favorite_border'} /></button>}

    </li>
};

export default ShowComment;
