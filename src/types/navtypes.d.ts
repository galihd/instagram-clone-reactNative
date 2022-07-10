import { PostType } from "./modeltypes"
import {CameraCapturedPicture} from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'


export type rootStackParamList = {
    loading : undefined
    signIn : undefined
    signUp : undefined
    main : undefined
}

export type homeStackParamList = {
    home : undefined
    Profile : {
        username : string
    }
    comments : {
        post : PostType
    }
    createPost : undefined
}

export type createPostStackParamList = {
    addNewPost : undefined
    postDetails : {
        selectedFiles : Array<MediaLibrary.Asset> | CameraCapturedPicture[] | undefined
    }
}