interface User {
    username: string;
    profileURL: string;
    
    // User page view:
    profilePhotoURL: string;
    realName : string;
    numberOfPosts : number;
    numberOfFollowers : number;
    numberFollowing : number;
    isMyProfile : boolean; // Is this the current user's profile
    
    // Does the curent user follow this person
    amFollowing: boolean;
}

export default User;
