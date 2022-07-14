import { collection, doc, FirestoreDataConverter, getDoc, getDocs, query, Query, setDoc, where } from "firebase/firestore";
import { Post } from "../../types/modeltypes";
import { db } from "../firebaseConfig";
import { downloadImage, downloadImages, uploadPost } from "../fireStorage";
import { convertAppUserToDownloadable } from "./usersRepo";

const PostConverter : FirestoreDataConverter<Post> = {
    fromFirestore : (snapshot,options) => ({...snapshot.data(options),postId : snapshot.id}) as Post,
    toFirestore : ({postId,...rest}) => rest
}

const postsCollections = collection(db,"Posts").withConverter(PostConverter)

const convertPostToDownloadble = async (postData : Post) : Promise<Post> => 
({
    ...postData,
    fileUrls : await downloadImages(postData.fileUrls),
    appUser : await convertAppUserToDownloadable(postData.appUser)
})



export const createPost = async (postData : Post) : Promise<Post> => {
    const docRef = doc(postsCollections);
    const storageUrls =  await uploadPost({...postData,postId : docRef.id})
    
    await setDoc(docRef,{
        ...postData,
        postId : docRef.id,
        fileUrls : storageUrls
    })
    return findPostById(docRef.id);
}

export const findPostById = async (postId : string) : Promise<Post> => {
    return  getDoc(doc(postsCollections,postId)).
            then(post => convertPostToDownloadble(post.data()!));
}

export const findPostsByUserId = async (appUserId:string) : Promise<Post[]>=> {
    const qSnap = await getDocs(query(postsCollections,where('appUser.appUserId','==',appUserId)));
    const result : Post[] = qSnap.docs.map(post => post.data());
    return Promise.all(result.map(convertPostToDownloadble));
}

export const findAllPostByUserGroup = async (appUserIds : string[]) : Promise<Post[]> => {
    const qSnap = await getDocs( query(postsCollections,where('appUser.appUserId','in',appUserIds)) );
    const result : Post[] = qSnap.docs.map(post => post.data());
    return Promise.all(result.map(convertPostToDownloadble));
}