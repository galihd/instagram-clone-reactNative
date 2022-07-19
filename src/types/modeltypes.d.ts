
export type AppUser = {
    appUserId : string
    email : string
    avatarUrl : string
    username : string
    phoneNumber? : string
    bio? : string
}


export type Post = {
    postId : string,
    appUserId? : string
    appUser : AppUser
    fileUrls : string[]
    caption? : string
    taggedPeople? : AppUser[] | string[]
    location? : string
    likesCount : number
    commentCount : number
    createdAt : Date
    postType : "post" | "reels"
}

export type Comment = {
    commentId : string
    postId : string
    appUserId? : string
    appUser : AppUser
    comment : string
    targetType : 'post' | 'comment'
    targetCommentId? : string
    likesCount : number
    createdAt : Date
}

export type Like = {
    likeId : string
    targetType : 'post' | 'comment'
    targetId : string
    appUserId ? : string
    appUser : AppUser
}

export type FollowType = {
    followId: string
    fromUserId : string
    toUserId : string
}


export type PostType = {
    image : string
    user : AppUser
    likes : number
    caption : string
    comments : Array<Comment>

}