import { userContextActionsType } from "./UserContextReducer";
import { userContextAction } from "../ContextTypes";
import { AppUser } from "../../types/modeltypes";
import AsyncStorage from '@react-native-async-storage/async-storage';



const APP_USER_STORAGE = "instCloneAppUser";


export const loadUserDataFromStorage = async() : Promise<AppUser> => {
   const userData = await AsyncStorage.getItem(APP_USER_STORAGE);
   if(userData){
      return JSON.parse(userData) as AppUser
   }

   return Promise.reject();
}

export const storeUserDataToStorage = (userData : AppUser) => {
   AsyncStorage.setItem(APP_USER_STORAGE, JSON.stringify(userData))
}

export const signUp = (createdUser : AppUser) : userContextAction => {
   return {
        type : userContextActionsType.signUp,
        payload : createdUser
   }
}

export const signIn = (user : AppUser) : userContextAction => {
   storeUserDataToStorage(user);
   return {
      type : userContextActionsType.signIn,
      payload : user
   }
}

export const signOut = () : userContextAction => {
   AsyncStorage.removeItem(APP_USER_STORAGE);
   return{
      type : userContextActionsType.signOut,
      payload : null
   }
}