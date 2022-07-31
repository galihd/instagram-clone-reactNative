import { userContextActionsType } from "./UserContextReducer";
import { userContextAction } from "../ContextTypes";
import { AppUser, Follow, FollowRelation, Post } from "../../types/modeltypes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateAvatar } from "../../FireBase/fireStorage";
import { saveUser } from "../../FireBase/fireStoreFunctions/usersRepo";
import { createFollow, deleteFollow, getUserFollowersByUserId, getUserFollowingByUserId } from "../../FireBase/fireStoreFunctions/followsRepo";
import { createPost, deletePost, findPostsByUserId } from "../../FireBase/fireStoreFunctions/postsRepo";



const APP_USER_STORAGE = "instCloneAppUser";
const APP_USER_STORAGE_ACTIVE = "instCloneActiveAppUser";




export const loadActiveUserDataFromStorage = async() : Promise<AppUser> => {
   const userData = await AsyncStorage.getItem(APP_USER_STORAGE_ACTIVE);
   if(userData){
      return JSON.parse(userData) as AppUser
   }

   return Promise.reject("Active userData not available");
}

export const loadUsersDataFromStorage = async() =>{
   return await AsyncStorage.getItem(APP_USER_STORAGE).then(usersData => JSON.parse(usersData!) as AppUser[])
} 

export const storeUserDataToStorage = async (userData : AppUser) => {
   let existingUserData = await loadUsersDataFromStorage();
   if(existingUserData){
      existingUserData = existingUserData.filter(data => data.appUserId !== userData.appUserId);
      
      AsyncStorage.setItem(APP_USER_STORAGE, JSON.stringify([...existingUserData, userData]));
   }else{
      AsyncStorage.setItem(APP_USER_STORAGE, JSON.stringify([userData]));
   }

   return await AsyncStorage.setItem(APP_USER_STORAGE_ACTIVE,JSON.stringify(userData));
}
   

export const signUp = (createdUser : AppUser) : userContextAction => 
   ({
        type : userContextActionsType.signUp,
        payload : createdUser
   })


export const signIn = async (user : AppUser) : Promise<userContextAction> => {
   return storeUserDataToStorage(user).then(() => (
      {
         type : userContextActionsType.signIn,
         payload : user
      }
   ))
}

export const signOut = async (user : AppUser) : Promise<userContextAction> => {
   const existingUserData = (await loadUsersDataFromStorage()).filter(data => data.appUserId !== user.appUserId);

   if(existingUserData.length > 0){
      await AsyncStorage.setItem(APP_USER_STORAGE, JSON.stringify(existingUserData))
      await AsyncStorage.setItem(APP_USER_STORAGE_ACTIVE,JSON.stringify(existingUserData[0]));
      return{
         type : userContextActionsType.signOut,
         payload : existingUserData[0]
      }
   }

   await AsyncStorage.removeItem(APP_USER_STORAGE);
   await AsyncStorage.removeItem(APP_USER_STORAGE_ACTIVE);
   return{
      type : userContextActionsType.signOut,
      payload : null
   }
}

export const updateUser = async (newUserData : AppUser,newAvatar? : string) : Promise<userContextAction> => {
   let newUrl = newAvatar ? newAvatar : newUserData.avatarUrl;

   if(newAvatar){
      newUrl = await updateAvatar(newUserData,newAvatar)
   }
   const savedUser = await saveUser({...newUserData,avatarUrl : newUrl});

   await storeUserDataToStorage(savedUser);
   return loadActiveUserDataFromStorage()
      .then((value) => 
         ({
            type : userContextActionsType.update,
            payload : value
         }))
}

export const setPosts = async (appUserId : string) : Promise<userContextAction> => {
   return await findPostsByUserId(appUserId)
   .then(result => ({
      type : userContextActionsType.setPosts,
      payload : result
   }));
}

export const addPost = async (Post : Post) : Promise<userContextAction> => {
   const createdPost = await createPost(Post);
   return ({
      type: userContextActionsType.addPost,
      payload: createdPost
   });
}

export const removePost = async (post: Post) : Promise<userContextAction> => {
   await deletePost(post)
   return{
      type : userContextActionsType.deletePost,
      payload : post
   }
}

export const setRelation = async (appUserId : string ) : Promise<userContextAction> => ({
   type : userContextActionsType.setRelation,
   payload : {
      following : await getUserFollowingByUserId(appUserId),
      followers : await getUserFollowersByUserId(appUserId)
   }
})

export const followAccount = async (stateUserId : string,targetUserId : string) : Promise<userContextAction> => {
   return {
      type : userContextActionsType.followAccount,
      payload : await createFollow(stateUserId,targetUserId)
   }
}

export const unFollowAccount = async (follow : Follow) : Promise<userContextAction> => {
   await deleteFollow(follow.followId)
   return {
      type : userContextActionsType.unFollowAccount,
      payload : follow
   }
}