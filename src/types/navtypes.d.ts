import { Post, PostType } from "./modeltypes"
import {CameraCapturedPicture} from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'


export type rootStackParamList = {
    signIn : undefined
    signUp : undefined
    main : undefined
    createPost : undefined
}


export type createPostStackParamList = {
    addNewPost : undefined
    postDetails : {
        selectedFiles : Array<MediaLibrary.Asset> | CameraCapturedPicture[] | undefined
    }
}

export type mainTabParamList = {
    Home : undefined
    Search : undefined
    Reels : undefined
    Shop : undefined
    Profile : undefined
}

export type mainStackParamList = {
    home : undefined
    profile : {
        appUserId : string
        fromHomeTab : boolean
    }
    comments : {
        post : Post
    }
    likes : {
        post : Post
    }
}

export type profileTobTabParamList = {
    userPosts : undefined
    userReels : undefined
    userTagged : undefined
}

