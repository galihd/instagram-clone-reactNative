export type User = {
    username : string
    email : string
    avatarUrl : string
}

export type Comment = {
    user : User
    comment : string
}

export type PostType = {
    image : string
    user : User
    likes : number
    caption : string
    comments : Array<Comment>

}