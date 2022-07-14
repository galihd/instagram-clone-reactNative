import { collection, doc, FirestoreDataConverter, getDoc, getDocs, query, Query, setDoc, where } from "firebase/firestore";
import { Post } from "../../types/modeltypes";
import { db } from "../firebaseConfig";
import { uploadPost } from "../fireStorage";

const PostConverter : FirestoreDataConverter<Post> = {
    fromFirestore : (snapshot,options) => ({...snapshot.data(options),postId : snapshot.id}) as Post,
    toFirestore : ({postId,...rest}) => rest
}

const postsCollections = collection(db,"Posts").withConverter(PostConverter)


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
    return (await getDoc(doc(postsCollections,postId))).data()!;
}

export const findPostsByUserId = async (appUserId:string) : Promise<Post[]>=> {
    const qSnap = await getDocs(query(postsCollections,where('appUser.appUserId','==',appUserId)));
    return qSnap.docs.map(post => post.data());
}

export const findAllPostByUserGroup = async (appUserIds : string[]) : Promise<Post[]> => {
    const qSnap = await getDocs( query(postsCollections,where('appUser.appUserId','in',appUserIds)) );
    return qSnap.docs.map(post => post.data());
}