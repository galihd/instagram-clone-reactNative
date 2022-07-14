import { Post, PostType } from "./modeltypes"
import {CameraCapturedPicture} from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'


export type rootStackParamList = {
    signIn : undefined
    signUp : undefined
    main : undefined
}

export type homeStackParamList = {
    home : undefined
    Profile : {
        appUserId : string
    }
    comments : {
        post : Post
    }
    likes : {
        postId : string
    }
    createPost : undefined
}

export type createPostStackParamList = {
    addNewPost : undefined
    postDetails : {
        selectedFiles : Array<MediaLibrary.Asset> | CameraCapturedPicture[] | undefined
    }
}