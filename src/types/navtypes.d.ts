import { PostType } from "./modeltypes"

export type authStackParamList = {
    Home : undefined
    SignIn : undefined
    Register : undefined
}

export type homeStackParamList = {
    addNewPost : undefined
    home : undefined
    Profile : {
        username : string
    }
    comments : {
        post : PostType
    }
}