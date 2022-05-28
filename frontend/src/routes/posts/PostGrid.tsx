import React from 'react';

import PostPreview from './PostPreview';

import {Post} from "../../models";
import './PostGrid.css';

interface Props {
    posts: Post[]
};

const PostGrid: React.FC<Props> = ({ posts }) => {
    return <section className='post-grid'>
        {posts.map((post) =>
            <PostPreview {...post} key={post.id}></PostPreview>
        )}
    </section>
};

export default PostGrid;
