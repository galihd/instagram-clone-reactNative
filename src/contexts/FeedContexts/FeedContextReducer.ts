import { Post } from "../../types/modeltypes";
import { feedContextAction, feedContextStateType } from "../ContextTypes";



export const initialFeedContextState : feedContextStateType = {
    FeedItems : []
}

export const feedContextActionsType = {
    createPost : 'CREATE_POST',
    readPost : 'READ_POST',
    updatePost : 'UPDATE_POST',
    deletePost : 'DELETE_POST',
    loadFeeds : 'LOAD_FEEDS',
    updateFeeds : 'UPDATE_FEEDS'
}

export const feedContextReducer = (state : feedContextStateType,action : feedContextAction) : feedContextStateType => {
    switch (action.type) {
        
        case feedContextActionsType.loadFeeds : return {
            ...state,
            FeedItems : action.payload as Post[]
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

        case feedContextActionsType.deletePost : {
            const postdata = action.payload as Post;
            return{
                ...state,
                FeedItems : state.FeedItems.filter(post => post != postdata)
            }
        }


        default:
            return initialFeedContextState;
    }
}