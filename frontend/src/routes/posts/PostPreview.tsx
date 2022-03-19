import React from 'react';

interface Props {
    photoId? : string
};

const PostPreview : React.FC<Props> = ({photoId}) => {
    return <div className='postPreview'>
        <img src="" alt="" />
    </div>
};

export default PostPreview;