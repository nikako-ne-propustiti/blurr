import React from 'react';
import PostPreview from './PostPreview';

interface Props {
    username? : string
};

const PostGrid : React.FC<Props> = ({username}) => {
    return <section className='postGrid'>
        <p>{username}'s posts:</p>
        <PostPreview photoId='image1'></PostPreview>
        <PostPreview photoId='nophoto'></PostPreview>
    </section>
};

export default PostGrid;