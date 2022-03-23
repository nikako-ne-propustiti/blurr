import React from 'react';



import './ShowPost.css';
import { CreateComment } from './comments';
import { Post } from '../../models';

interface Props {
    post: Post;
}

const ShowPost: React.FC<Props> = ({post}) => {

    const imageDoubleClick = () => {
        console.log("Double click");
    }

    return (
        <div className="wrapper">
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

                <div className="comments">
                    <ul>
                    {post.comments.map(c =>
                        <li key={c.id} className="comment">
                            <img src={c.commenter.profilePhotoURL} />
                            <div className="comm">
                                <div className="comm-top">
                                    <a href={c.commenter.profileURL}>{c.commenter.username}</a>
                                    {c.text}
                                </div>
                                <div className="comm-bottom">
                                    <span>1 minute ago</span>

                                    {c.likes == 0 ? null : <span>{c.likes + (c.likes == 1 ? " like" : " likes")}</span>}
                                   
                                    <button>Reply</button>
                                </div>
                            </div>

                            <span className="material-icons">
                                {c.haveLiked ? "pie_chart" : "favorite"}
                            </span>   
                        </li>
                    )}
                    </ul>
                </div>

                <div>

                    <span className="material-icons">
                        {post.haveLiked ? "pie_chart" : "favorite"}
                    </span>   

                    <input type="text" className="key-box" placeholder="Enter the key"/>

                    <div>
                        Liked by stan, elizabeth, and 39 others
                    </div>

                </div>

                <CreateComment />

            </div>
        </div>
    );
}

export default ShowPost;
