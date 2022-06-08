import React, {useCallback} from 'react';
import {Comment} from '../../../models';
import Icon from '../../../shared/Icon';
import {Link} from 'react-router-dom';
import {CDN_URL} from '../../../api';

import './ShowComment.css';

interface Props {
    comment: Comment;
    onReply?: (user: string, parentCommentId: number) => void;
    onLike?: (comment: Comment) => void;
}

const formatTimeAgo = (time: Date) => {
    const ms = Date.now() - (new Date(time)).getTime();
    const s = ms / 1000;
    const m = s / 60;
    const h = m / 60;
    const d = h / 24;
    const mo = d / 30;
    const y = d / 365;
    if (y >= 1) {
        return `${Math.floor(y)}y`;
    }
    if (mo >= 1) {
        return `${Math.floor(mo)}mo`;
    }
    if (d >= 1) {
        return `${Math.floor(d)}d`;
    }
    if (h >= 1) {
        return `${Math.floor(h)}h`;
    }
    if (m >= 1) {
        return `${Math.floor(m)}m`;
    }
    if (s >= 1) {
        return `${Math.floor(s)}s`;
    }
    return 'now';
};

const ShowComment: React.FC<Props> = ({comment, onReply, onLike}) => {
    const {id, commenter, text, likes, haveLiked, time, parentCommentId} = comment;

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

    return <li key={id} className={`comment ${parentCommentId ? 'reply' : ''}`}>
        <img src={`${CDN_URL}${commenter.profilePhotoURL}`} />
        <div className="comm">
            <div className="comm-top">
                <Link to={`/${commenter.username}`}>{commenter.username}</Link>
                {text}
            </div>
            <div className="comm-bottom">
                <span>{formatTimeAgo(time)}</span>

                {likes > 0 && <span>{`${likes} ${likes === 1 ? 'like' : 'likes'}`}</span>}
                
                {onReply && !parentCommentId && <button onClick={onReplyClick}>Reply</button>}
            </div>
        </div>

        {onLike && <button onClick={onLikeClick}><Icon name={haveLiked ? 'favorite' : 'favorite_border'} /></button>}

    </li>
};

export default ShowComment;
