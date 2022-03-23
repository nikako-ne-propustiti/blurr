import React from 'react';

import PostBasicInfo from '../../models/PostBasicInfo';
import PostPreview from './PostPreview';

import './PostGrid.css';

interface Props {
    posts: PostBasicInfo[]
};

const PostGrid: React.FC<Props> = ({ posts }) => {
    return <section className='post-grid'>
        {posts.map((post) =>
            <PostPreview {...post} key={post.id}></PostPreview>
        )}
    </section>
};

export default PostGrid;
