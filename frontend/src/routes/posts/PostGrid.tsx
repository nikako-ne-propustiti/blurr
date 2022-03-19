import React from 'react';

interface Props {
    username? : string
};

const PostGrid : React.FC<Props> = ({username}) => {
    return <section className='postGrid'>
        <p>{username}'s posts:</p>
    </section>
};

export default PostGrid;