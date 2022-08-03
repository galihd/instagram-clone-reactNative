import { Post, PostType } from "./modeltypes"
import {CameraCapturedPicture} from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'


export type rootStackParamList = {
    signIn : undefined
    signUp : undefined
    main : undefined
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
    home : {
        postingFile? : string
    }
    createPost : undefined
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
    ProfilePost : {
        posts : Array<Post>
    }
    ProfileEdit : {
        newAvatar? : MediaLibrary.Asset
    }
    ProfileGallery : undefined

}

export type profileTobTabParamList = {
    userPosts : undefined
    userReels : undefined
    userTagged : undefined
}

