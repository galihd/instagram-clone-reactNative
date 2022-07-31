import React from "react"
import { AppUser, Follow, FollowRelation, Post } from "../types/modeltypes"

//USER CONTEXT===================================
export type userContextStateType = {    
    isAuthenticated : boolean
    user : AppUser | undefined
    userPosts : Post[]
    relation : FollowRelation
}

export type userContextAction = {
    type : string
    payload : AppUser | FollowRelation | Follow | Post | Post[] | string | null
}

export type userContextType = {
    state : userContextStateType
    dispatch : React.Dispatch<userContextAction>
}

//FEED CONTEXT===================================

export type feedContextStateType = {
    FeedItems : Array<Post>
}

export type feedContextAction = {
    type : string
    payload : Post | Post[] | null
}

export type feedContextType = {
    state : feedContextStateType
    dispatch : React.Dispatch<feedContextAction>
}
