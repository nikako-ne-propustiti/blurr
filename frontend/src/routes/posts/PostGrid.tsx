import React from 'react';
import PostPreview from './PostPreview';
import './PostGrid.css';
import Post from '../../models/Post';

interface Props {
    posts: Post[]
};

const PostGrid: React.FC<Props> = ({ posts }) => {
    return <section className='post-grid'>
        {posts.map((post) =>
            <PostPreview {...post} key={post.postID}></PostPreview>
        )}
    </section>
};

export default PostGrid;