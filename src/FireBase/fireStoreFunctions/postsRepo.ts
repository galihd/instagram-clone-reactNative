import { collection, deleteDoc, doc, FirestoreDataConverter, getDoc, getDocs, increment, query, Query, setDoc, updateDoc, where, writeBatch, WriteBatch } from "firebase/firestore";
import { Comment, Like, Post } from "../../types/modeltypes";
import { db } from "../firebaseConfig";
import { deletePostDirectory, downloadImage, downloadImages, uploadPost } from "../fireStorage";
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

export const deletePost = async (postData : Post) => {
    deleteDoc(  doc(postsCollections,postData.postId) )
    deleteAllLikesByPostId(postData.postId)
    deleteAllCommentsByPostId(postData.postId)
    deletePostDirectory(postData);
}

export const deletePostById =async (postId:string) => {
    const targetPost = await findPostById(postId);
    deleteDoc( doc(postsCollections,postId) );
    deleteAllCommentsByPostId(postId)
    deleteAllLikesByPostId(postId)
    deletePostDirectory(targetPost)
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

export const deleteCommentById = (commentId : string ) => deleteDoc( doc(commentsCollections,commentId) );

export const deleteAllCommentsByPostId = async (postId : string) => {
    const batch = writeBatch(db);
    const qSnap = await getDocs( query(commentsCollections,where('postId','==',postId),where('targetType','==','post')) );
    qSnap.docs
        .map(snap => snap.ref)
        .forEach(docref => {
            deleteAllLikesByCommentId(docref.id)
            deleteAllCommentRepliesByCommentId(docref.id)
            batch.delete(docref)
        })

    return batch.commit()
}

export const deleteAllCommentRepliesByCommentId = async (commentId : string) => {
    const batch = writeBatch(db);

    const qSnap = await getDocs( query(commentsCollections,where('postId','==',commentId),where('targetType','==','comment')) );
    if(qSnap.size > 0)
        qSnap.docs
        .map(snap => snap.ref)
        .forEach(ref => batch.delete(ref))
    
    return batch.commit();   
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
    const qSnap = await getDocs( query(likesCollections,where('targetId','==',targetId),where('targetType','==','post')) );
    
    return Promise.all( 
        qSnap.docs
        .map(like=>like.data())
        .map(convertLikeToDownloadble) )
}

export const findAllCommentLikesByCommentId = async (targetId:string) => {
    const qSnap = await getDocs( query(likesCollections,where('targetId','==',targetId),where('targetType','==','comment')) );
    
    return Promise.all( 
        qSnap.docs
        .map(like=>like.data())
        .map(convertLikeToDownloadble) )
}

export const deleteLike = async (like : Like) => {
    await updateDoc(doc(postsCollections, like.targetId), { likesCount: increment(-1) });
    return await deleteDoc(doc(likesCollections, like.likeId));
}

export const deleteAllLikesByPostId = async ( postId : string ) => {
    const batch = writeBatch(db);
    const qSnap = await getDocs( query(likesCollections,where('targetId','==',postId),where('targetType','==','post')) );
    qSnap.docs
        .map(snap => snap.ref)
        .forEach(ref => batch.delete(ref))

    return batch.commit()
}

export const deleteAllLikesByCommentId = async ( commmentId : string ) => {
    const batch = writeBatch(db);
    const qSnap = await getDocs( query(likesCollections,where('targetId','==',commmentId),where('targetType','==','comment')) );
        qSnap.docs
        .map(snap => snap.ref)
        .forEach(ref => batch.delete(ref))

    return batch.commit()
}