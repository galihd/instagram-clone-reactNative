import { Post } from "../../types/modeltypes";
import { feedContextAction, feedContextStateType } from "../ContextTypes";



export const initialFeedContextState : feedContextStateType = {
    FeedItems : [],
    userPosts : [],
    isMuted : false
}

export const feedContextActionsType = {
    setUserPost : 'SET_USER_POST',
    updatePost : 'UPDATE_POST',
    deletePost : 'DELETE_POST',
    loadFeeds : 'LOAD_FEEDS',
    addFeed : 'ADD_FEED',
    updateFeeds : 'UPDATE_FEEDS',
    readPost : 'READ_POST',
    muteFeeds : 'MUTE_FEEDS',
    unMuteFeeds : 'UNMUTE_FEEDS',
}

export const feedContextReducer = (state : feedContextStateType,action : feedContextAction) : feedContextStateType => {
    switch (action.type) {
        
        case feedContextActionsType.loadFeeds : return {
            ...state,
            FeedItems : action.payload as Post[]
        }

        case feedContextActionsType.setUserPost : return{
            ...state,
            userPosts : action.payload as Post[]
        }

        case feedContextActionsType.addFeed : return {
            ...state,
            userPosts : [action.payload as Post,...state.userPosts],
            FeedItems : [action.payload as Post,...state.FeedItems]
        }

        case feedContextActionsType.updateFeeds : {
            const postdata = action.payload as Post;
            return{
                ...state,
                FeedItems : state.FeedItems.map(feedItem => {
                    if(feedItem.postId === postdata.postId) 
                        return {...feedItem,...postdata}
                    return feedItem
                })
            }
        }       

        case feedContextActionsType.deletePost : return{
            ...state,
            userPosts : state.userPosts.filter(posts => posts.postId != (action.payload as Post).postId),
            FeedItems : state.FeedItems.filter(posts => posts.postId != (action.payload as Post).postId)
        }

        case feedContextActionsType.muteFeeds: return{
            ...state,
            isMuted : true
        }
        case feedContextActionsType.unMuteFeeds: return{
            ...state,
            isMuted : false
        }

        default:
            return initialFeedContextState;
    }
}


