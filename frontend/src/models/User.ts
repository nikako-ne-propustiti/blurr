interface User {
    id: string;
    username: string;
    realName: string;
    profileURL: string;
    profilePhotoURL: string;
    // Does the curent user follow this person
    amFollowing: boolean;
}

export default User;
