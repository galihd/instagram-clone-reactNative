
export type AppUser = {
    appUserId : string
    email : string
    username? : string
    phoneNumber? : string
    avatarUrl? : string
}


export type Post = {
    postId : string
    appUser : AppUser
    fileUrls : string[]
    caption? : string
    taggedPeople? : AppUser[]
    location? : string
    likesCount : number
}

export type Comment = {
    commentId : string
    postId : string
    appUser : AppUser
    comment : string
}

export type Like = {
    likeId : string
    postId : string
    appUser : AppUser
}


export type PostType = {
    image : string
    user : AppUser
    likes : number
    caption : string
    comments : Array<Comment>

}