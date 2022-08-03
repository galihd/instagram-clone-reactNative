import {deleteObject, getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import {Asset} from 'expo-media-library'
import { cloudStorage } from './firebaseConfig'
import { AppUser, Post } from '../types/modeltypes';

type File = Blob | Uint8Array | ArrayBuffer;

const storageRef = ref(cloudStorage);
const userPostRef = (postData : Post) => ref(storageRef,`${postData.appUser.appUserId}/post/${postData.postId}`)
const userAvatarRef = (userData : AppUser) => ref(storageRef,`${userData.appUserId}/${userData.email}.jpg`)


export const uploadPost = (postData : Post) : Promise<string[]> => {
    const fileUrls = postData.fileUrls.map(async (url,index) => {
        const uploadRef = postData.postType === 'post' ? ref(userPostRef(postData),`${index}.jpg`) : ref(userPostRef(postData),`${index}.mp4`)
        const file : File = await (await fetch(url)).blob();
        const result = await uploadBytes(uploadRef,file);
        return result.ref.fullPath
    })
    return Promise.all(fileUrls);
}

export const updateAvatar = async (userData : AppUser,newFilePath : string) : Promise<string> => {
    const newFile: File = await (await fetch(newFilePath)).blob();
    const result = await uploadBytes(userAvatarRef(userData), newFile);
    return result.ref.fullPath;

}

export const deletePostDirectory = (postData : Post) => postData.fileUrls.forEach((data,index)=> deleteObject( ref(userPostRef(postData),`${index}.jpg`) ))


export const downloadImages = (fileUrls : string[]) => Promise.all( fileUrls.map(url => getDownloadURL( ref(storageRef,url) )) )

export const downloadImage = (fileUrl : string ) => getDownloadURL( ref(storageRef,fileUrl) )

export const downloadImageAsBase64 = async (downloadableFileUrl : string) => {
    const fileBlob = await fetch(downloadableFileUrl).then(response => response.blob());
    
    const convertBlobToBase64 = (blob : Blob) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
    });
    
    const base64string = (await convertBlobToBase64(fileBlob)).split(',')[1];
    return  require('buffer').Buffer.from(base64string,'base64')
}