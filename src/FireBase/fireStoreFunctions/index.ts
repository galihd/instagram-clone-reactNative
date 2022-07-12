import { collection, FirestoreDataConverter } from "firebase/firestore"
import { AppUser, Post } from "../../types/modeltypes"
import { db } from "../firebaseConfig"
import * as usersRepo from './usersRepo'
import * as postRepo from './postsRepo'


const AppUserConverter : FirestoreDataConverter<AppUser> = {
    fromFirestore : (snapshot,options) => ({...snapshot.data(options),appUserId : snapshot.id}) as AppUser,
    toFirestore : ({appUserId,...rest}) => rest
} 

const PostConverter : FirestoreDataConverter<Post> = {
    fromFirestore : (snapshot,options) => ({...snapshot.data(options),postId : snapshot.id}) as Post,
    toFirestore : ({postId,...rest}) => rest
}

export const dbCollections = {
    appUser: collection(db,"AppUsers").withConverter(AppUserConverter),
    post : collection(db,"Posts").withConverter(PostConverter)
}

export {
    usersRepo,
    postRepo
}