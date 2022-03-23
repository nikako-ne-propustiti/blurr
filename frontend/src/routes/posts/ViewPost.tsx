import React from 'react';
import { ShowPost } from '.';

import { Comment, User, Post } from '../../models';

const users: User[] = [
    {
        id: "id",
        username: "john", 
        realName: "john doe", 
        profileURL: "https://picsum.photos/400",
        profilePhotoURL: "https://picsum.photos/400",
        amFollowing: true,
    },
    {
        id: "id",
        username: "alex", 
        realName: "alex young", 
        profileURL: "https://picsum.photos/500",
        profilePhotoURL: "https://picsum.photos/500",
        amFollowing: false,
    },
    {
        id: "id",
        username: "sara", 
        realName: "sara mack", 
        profileURL: "https://picsum.photos/600",
        profilePhotoURL: "https://picsum.photos/600",
        amFollowing: false,
    }
]



const ViewPost: React.FC = () => {

    const comments: Comment[] = [
        {
            id: "id",
            text: "zdravo",
            likes: 1,
            time: new Date(),
            commenter: users[0],
            haveLiked: false
        },
        {
            id: "id",
            text: "pozdrav",
            likes: 1,
            time: new Date(),
            commenter: users[2],
            haveLiked: true
        },
        {
            id: "id",
            text: "cao",
            likes: 0,
            time: new Date(),
            commenter: users[0],
            haveLiked: true
        }
    ]

    const post: Post = {
        id: "id",
        poster: users[1],
        time: new Date(),
        description: "hello",
        photoURL: "https://picsum.photos/600",
        comments
    }

    return (
        <ShowPost post={post} />
    );
}

export default ViewPost;
