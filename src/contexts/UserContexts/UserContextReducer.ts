import { AppUser, Follow, FollowRelation, Post } from "../../types/modeltypes";
import { userContextAction, userContextStateType } from "../ContextTypes";

export const initialUserContextState : userContextStateType = {
    isAuthenticated : false,
    user : undefined,
    relation : {
        followers : [],
        following : []
    },
    userPosts : []
}

export const userContextActionsType = {
    signUp : 'SIGN_UP',
    signIn : 'SIGN_IN',
    signOut : 'SIGN_OUT',
    update : 'UPDATE_USER',
    setRelation : 'SET_RELATION',
    setPosts : 'SET_POSTS',
    addPost : 'ADD_POST',
    deletePost : 'DELETE_POST',
    followAccount : 'FOLLOW_ACCOUNT',
    unFollowAccount : 'UNFOLLOW_ACCOUNT'
}

export const userContextReducer = (state : userContextStateType,action : userContextAction) : userContextStateType => {
    switch(action.type){
        case userContextActionsType.signUp : return {
            ...state
        }
        case userContextActionsType.signIn : return {
            ...initialUserContextState,
            user : action.payload! as AppUser,
            isAuthenticated : true
        }
        case userContextActionsType.update : return {
            ...state,
            user : action.payload! as AppUser
        }
        case userContextActionsType.setRelation : return {
            ...state,
            relation : action.payload as FollowRelation
        }
        case userContextActionsType.followAccount : return{
            ...state,
            relation : {
                followers : state.relation.followers,
                following : [...state.relation.following,action.payload as Follow]
            }
        }
        case userContextActionsType.unFollowAccount : return{
            ...state,
            relation : {
                followers : state.relation.followers,
                following : state.relation.following.filter(follow => follow.followId !== (action.payload as Follow).followId)
            }
        }

        case userContextActionsType.setPosts : return{
            ...state,
            userPosts : action.payload as Post[]
        }

        case userContextActionsType.addPost : return {
            ...state,
            userPosts : [...state.userPosts,action.payload as Post]
        }

        case userContextActionsType.deletePost : return{
            ...state,
            userPosts : state.userPosts.filter(posts => posts.postId != (action.payload as Post).postId)
        }

        case userContextActionsType.signOut : return action.payload ? ({
            user : action.payload as AppUser,
            isAuthenticated : true,
            relation : {
                followers : [],
                following : [],
            },
            userPosts : []
        }) : initialUserContextState

        default : return initialUserContextState
    }
}