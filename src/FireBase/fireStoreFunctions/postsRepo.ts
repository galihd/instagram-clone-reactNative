import { collection, deleteDoc, doc, FirestoreDataConverter, getDoc, getDocs, increment, query, Query, setDoc, updateDoc, where } from "firebase/firestore";
import { Comment, Like, Post } from "../../types/modeltypes";
import { db } from "../firebaseConfig";
import { downloadImage, downloadImages, uploadPost } from "../fireStorage";
import { findAppUserById } from "./usersRepo";

const PostConverter : FirestoreDataConverter<Post> = {
    fromFirestore : (snapshot,options) => ({...snapshot.data(options),postId : snapshot.id}) as Post,
    toFirestore : ({postId,appUser,...rest} : Post) => ({...rest,appUserId : appUser.appUserId}) as Post
}

const CommentConverter : FirestoreDataConverter<Comment> = {
    fromFirestore : (snapshot,options) => ({...snapshot.data(options),commentId : snapshot.id}) as Comment,
    toFirestore : ({commentId,appUser,...rest} : Comment) => ({...rest,appUserId : appUser.appUserId}) as Comment
}

const LikeConverter : FirestoreDataConverter<Like> = {
    fromFirestore : (snapshot,options) => ({...snapshot.data(options),likeId : snapshot.id}) as Like,
    toFirestore : ({likeId,appUser,...rest} : Like) => ({...rest,appUserId : appUser.appUserId}) as Like
}

const postsCollections = collection(db,"Posts").withConverter(PostConverter)
const commentsCollections = collection(db,"Comments").withConverter(CommentConverter)
const likesCollections = collection(db,"Likes").withConverter(LikeConverter);

const convertPostToDownloadble = async (postData : Post) : Promise<Post> => 
({
    ...postData,
    fileUrls : await downloadImages(postData.fileUrls),
    appUser : await findAppUserById(postData.appUserId!)
})

const convertCommentToDownloadble = async (commentData : Comment) : Promise<Comment> => 
({
    ...commentData,
    appUser : await findAppUserById(commentData.appUserId!)
})

const convertLikeToDownloadble = async (likeData : Like) : Promise<Like> => 
({
    ...likeData,
    appUser : await findAppUserById(likeData.appUserId!)
})

// POSTS SECTION==========================================================
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
    const qSnap = await getDocs(query(postsCollections,where('appUserId','==',appUserId)));
    const result : Post[] = qSnap.docs.map(post => post.data());
    return Promise.all(result.map(convertPostToDownloadble));
}

export const findAllPostByUserGroup = async (appUserIds : string[]) : Promise<Post[]> => {
    const qSnap = await getDocs( query(postsCollections,where('appUserId','in',appUserIds)) );
    const result : Post[] = qSnap.docs.map(post => post.data());
    return Promise.all(result.map(convertPostToDownloadble));
}


// COMMENTS SECTION==========================================================
export const createComment = async (comment : Comment) : Promise<Comment>=> {
    const docRef = doc(commentsCollections);
    
    const commentData : Comment = {
        ...comment,
        commentId : docRef.id
    }
    await setDoc(docRef,commentData)

    commentData.targetType === "post" ?
    await updateDoc( doc(postsCollections,comment.postId),{commentCount : increment(1)} )
    :
    await updateDoc( doc(commentsCollections,comment.postId),{replyCount : increment(1)} )

    return commentData
}

export const findCommentById = async (commentId : string ) : Promise<Comment> => {
    return getDoc( doc(commentsCollections,commentId) )
        .then(comment => convertCommentToDownloadble(comment.data()!))
}

export const findAllCommentsByPostId =async (postId:string) : Promise<Comment[]> => {
    const qSnap = await getDocs( query(commentsCollections,where('postId','==',postId)) );
    return Promise.all( 
        qSnap.docs
        .map(comment => comment.data())
        .map(convertCommentToDownloadble) 
        )
    
}



// LIKES SECTION==========================================================
export const createLike = async (like: Like) =>{
    const docRef = doc(likesCollections)
    const likeData : Like = {
        ...like,
        likeId : docRef.id
    }

    await setDoc(docRef,likeData)

    like.targetType === "post" ? 
    await updateDoc( doc(postsCollections,likeData.targetId), {likesCount : increment(1)})
    : await updateDoc( doc(commentsCollections,likeData.targetId), {likesCount : increment(1)} )

    return likeData;
}

export const findAllPostLikeByPostId = async(targetId : string) : Promise<Like[]> =>{
    const qSnap = await getDocs( query(likesCollections,where('targetId','==',targetId)) );
    
    return Promise.all( 
        qSnap.docs
        .map(like=>like.data())
        .map(convertLikeToDownloadble) )
}

export const deleteLike = async (like : Like) => {
    await updateDoc(doc(postsCollections, like.targetId), { likesCount: increment(-1) });
    return await deleteDoc(doc(likesCollections, like.likeId));
}