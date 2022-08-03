import { createPost, deletePost, findAllPostByUserGroup, findPostsByUserId } from "../../FireBase/fireStoreFunctions/postsRepo";
import { Post } from "../../types/modeltypes";
import { feedContextAction} from "../ContextTypes";
import { feedContextActionsType, initialFeedContextState } from "./FeedContextReducer";


export const setPosts = async (appUserId : string) : Promise<feedContextAction> => {
    return await findPostsByUserId(appUserId)
    .then(result => ({
       type : feedContextActionsType.setUserPost,
       payload : result
    }));
 }
 
 export const addPost = async (Post : Post) : Promise<feedContextAction> => {
    const createdPost = await createPost(Post);
    return ({
       type: feedContextActionsType.addFeed,
       payload: createdPost
    });
 }
 
 export const removePost = async (post: Post) : Promise<feedContextAction> => {
    await deletePost(post)
    return{
       type : feedContextActionsType.deletePost,
       payload : post
    }
 }

export const loadFeeds = async (followingGroupIds : string[]) : Promise<feedContextAction> => {
    const feeds = await findAllPostByUserGroup(followingGroupIds)
    return {
        type : feedContextActionsType.loadFeeds,
        payload : feeds
    }
}

export const updateFeeds = (postData : Post) : feedContextAction => {
    return {
        type : feedContextActionsType.updateFeeds,
        payload : postData
    }
}

export const deletePostRequest = async (postData : Post) : Promise<feedContextAction> =>  {
    return deletePost(postData).then(() => 
        ({
            type : feedContextActionsType.deletePost,
            payload : postData
        }));
}

export const muteFeeds = () : feedContextAction => ({
    type : feedContextActionsType.muteFeeds,
    payload : null,
})

export const unMuteFeeds = () : feedContextAction => ({
    type : feedContextActionsType.unMuteFeeds,
    payload : null,
})

