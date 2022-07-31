import { deletePost, findAllPostByUserGroup } from "../../FireBase/fireStoreFunctions/postsRepo";
import { Post } from "../../types/modeltypes";
import { feedContextAction} from "../ContextTypes";
import { feedContextActionsType } from "./FeedContextReducer";

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

