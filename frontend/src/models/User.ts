interface User {
    id: string;
    username: string;
    realName: string;
    profileURL: string;
    profilePhotoURL: string;
    numberOfPosts : number;
    numberOfFollowers : number;
    numberFollowing : number;
    // Does the curent user follow this person
    amFollowing: boolean;
}

export default User;
