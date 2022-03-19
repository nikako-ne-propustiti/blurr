import React from 'react';
import { useParams } from 'react-router-dom';
import { accountInfo } from '../../api';
import PostGrid from './PostGrid';
import { ProfilePhotoChanger } from '../accounts';

const ViewUserFeed: React.FC = () => {
    const { username } = useParams();

    React.useEffect(() => {
        // Fetch user data from API here

        setPostCount(238);
        setCreationDate(new Date());
        setFollowerCount(4);
        setUnblurrCount(1);
    }, [username]);

    // Introduce loading/error state etc.

    const [postCount, setPostCount] = React.useState(0);
    const [unblurrCount, setUnblurrCount] = React.useState(0);
    const [followerCount, setFollowerCount] = React.useState(0);
    const [creationDate, setCreationDate] = React.useState(new Date());

    return (
        <>
            <section className="userProfileInfo">
                <div className="profilePhoto">
                    <ProfilePhotoChanger username={username}></ProfilePhotoChanger>
                </div>
                <h1>{username}'s profile</h1>
                <div>
                    <p>{postCount} posts</p>
                </div>
            </section>
            <hr />
            <PostGrid username={username}></PostGrid>
        </>
    );
}

export default ViewUserFeed;
