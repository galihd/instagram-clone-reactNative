import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import {Asset} from 'expo-media-library'
import { cloudStorage } from './firebaseConfig'
import { Post } from '../types/modeltypes';

const storageRef = ref(cloudStorage);
const postsRef = ref(cloudStorage,'posts')
type File = Blob | Uint8Array | ArrayBuffer;

export const uploadPost = (postData : Post) : Promise<string[]> => {
    const fileUrls = postData.fileUrls.map(async (url,index) => {
        const uploadRef = ref(postsRef,`${postData.appUser.appUserId}/${postData.postId}/${index}.jpg`)
        const file : File = await (await fetch(url)).blob();
        const result = await uploadBytes(uploadRef,file);
        return result.ref.toString()
    })
    return Promise.all(fileUrls);
}

export const downloadImages = (fileUrls : string[]) => Promise.all( fileUrls.map(url => getDownloadURL( ref(storageRef,url) )) )

export const downloadImage = (fileUrl : string ) => getDownloadURL( ref(storageRef,fileUrl) )

export const downloadImageAsBase64 = async (fileUrl : string) => {
    const downloadableUrl = await getDownloadURL ( ref(storageRef,fileUrl) );
    const fileBlob = await fetch(downloadableUrl).then(response => response.blob());
    
    const convertBlobToBase64 = (blob : Blob) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader;
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
    });
    
    return (await convertBlobToBase64(fileBlob)).split(',')[1];
}