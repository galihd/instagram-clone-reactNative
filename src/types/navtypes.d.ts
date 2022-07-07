import { PostType } from "./modeltypes"

export type authStackParamList = {
    Home : undefined
    SignIn : undefined
    Register : undefined
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
        selectedFiles : Array<MediaLibrary.Asset> | MediaLibrary.Asset | CameraCapturedPicture
    }
}