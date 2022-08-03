import React from "react"
import { AppUser, Follow, FollowRelation, Post } from "../types/modeltypes"

//USER CONTEXT===================================
export type userContextStateType = {    
    isAuthenticated : boolean
    user : AppUser | undefined
    relation : FollowRelation
}

export type userContextAction = {
    type : string
    payload : AppUser | FollowRelation | Follow | string | null
}

export type userContextType = {
    state : userContextStateType
    dispatch : React.Dispatch<userContextAction>
}

//FEED CONTEXT===================================

export type feedContextStateType = {
    userPosts : Post[]
    FeedItems : Array<Post>
    isMuted : boolean
}

export type feedContextAction = {
    type : string
    payload : Post | Post[] | null
}

export type feedContextType = {
    state : feedContextStateType
    dispatch : React.Dispatch<feedContextAction>
}
