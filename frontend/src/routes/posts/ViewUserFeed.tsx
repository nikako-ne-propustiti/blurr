import React from 'react';
import { useParams } from 'react-router-dom';

const ViewUserFeed: React.FC = () => {
    const {username} = useParams();
    return (
        <div>
            User: {username}
        </div>
    );
}

export default ViewUserFeed;
