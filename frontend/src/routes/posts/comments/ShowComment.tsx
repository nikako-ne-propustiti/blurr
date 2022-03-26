import React, {useCallback, useContext} from 'react';
import {Comment} from '../../../models';
import Icon from '../../../shared/Icon';
import {Link} from 'react-router-dom';

import './ShowComment.css';

interface Props {
    comment: Comment;
    onReply: (user: string) => void;
    onLike?: (comment: Comment) => void;
}

const ShowComment: React.FC<Props> = ({comment, onReply, onLike}) => {
    const {id, commenter, text, likes, haveLiked} = comment;
    const onReplyClick = useCallback(() => {
        onReply(commenter.username);
    }, [commenter]);
    const onLikeClick = useCallback(() => {
        if (onLike) {
            onLike(comment);
        }
    }, [comment]);
    return <li key={id} className="comment">
        <img src={commenter.profilePhotoURL} />
        <div className="comm">
            <div className="comm-top">
                <Link to={`/${commenter.username}`}>{commenter.username}</Link>
                {text}
            </div>
            <div className="comm-bottom">
                <span>1 minute ago</span>

                {likes > 0 && <span>{`${likes} ${likes === 1 ? 'like' : 'likes'}`}</span>}
                
                <button onClick={onReplyClick}>Reply</button>
            </div>
        </div>

        <button onClick={onLikeClick}><Icon name={haveLiked ? 'favorite' : 'favorite_border'} /></button>

    </li>
};

export default ShowComment;
