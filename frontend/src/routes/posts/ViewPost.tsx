import React from 'react';
import { ShowPost } from '.';

import { Comment, User, Post } from '../../models';

const users: User[] = [
    {
        id: 1,
        username: "john", 
        realName: "john doe", 
        profileURL: "https://picsum.photos/400",
        profilePhotoURL: "https://picsum.photos/400",
        amFollowing: true,
        numberOfPosts: 0,
        numberOfFollowers: 0,
        numberFollowing: 0
    },
    {
        id: 2,
        username: "alex", 
        realName: "alex young", 
        profileURL: "https://picsum.photos/500",
        profilePhotoURL: "https://picsum.photos/500",
        amFollowing: false,
        numberOfPosts: 0,
        numberOfFollowers: 0,
        numberFollowing: 0
    },
    {
        id: 3,
        username: "sara", 
        realName: "sara mack", 
        profileURL: "https://picsum.photos/600",
        profilePhotoURL: "https://picsum.photos/600",
        amFollowing: false,
        numberOfPosts: 0,
        numberOfFollowers: 0,
        numberFollowing: 0
    }
];

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
];

const post: Post = {
    id: "id",
    poster: users[1],
    time: new Date(),
    description: "hello",
    photoURL: "https://picsum.photos/600",
    comments,
    haveLiked: false
};

const ViewPost: React.FC = () => {
    return (
        <ShowPost post={post} />
    );
}

export default ViewPost;
