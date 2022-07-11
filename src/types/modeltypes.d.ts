
export type AppUser = {
    appUserId : string
    email : string
    username? : string
    phoneNumber? : string
    avatarUrl? : string
}

export type Comment = {
    user : AppUser
    comment : string
}

export type Post = {
    files : string | string[],
    caption : string,
    appUser : AppUser
}

export type PostType = {
    image : string
    user : AppUser
    likes : number
    caption : string
    comments : Array<Comment>

}