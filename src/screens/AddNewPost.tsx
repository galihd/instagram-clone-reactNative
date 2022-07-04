import { PermissionsAndroid, Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import {Camera} from 'expo-camera'
import CameraRoll from "@react-native-community/cameraroll";
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as MediaLibrary from 'expo-media-library'
import * as Yup from 'yup'
import {Formik} from 'formik'



const validationSchema = Yup.object({
  "fileUrl" : Yup.string().url().required(),
  "caption" : Yup.string().notRequired().max(1500)
})

const AddNewPost = () => {
  const [previewFile, setPreviewFile] = useState<string>("");
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [allowMultiple, setAllowMultiple] = useState<boolean>(false);
  const [selectedFiles, setselectedFiles] = useState<Array<string> | string>();

  const requestFilePermission = async () => {
    const cameraPermissions = await Camera.requestCameraPermissionsAsync();
    const mediaLibraryPermissions = await MediaLibrary.requestPermissionsAsync();
    if(mediaLibraryPermissions.granted){
      getMedias();
    }
    // const permissions = (Platform.OS === 'android' && PermissionsAndroid)
    // if(permissions){
    //   permissions.requestMultiple(
    //     [
    //       permissions.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //       permissions.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //       permissions.PERMISSIONS.CAMERA
    //   ]).then((result) => {
    //       if(result['android.permission.CAMERA'] === 'granted' &&
    //          result['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
    //          result['android.permission.READ_EXTERNAL_STORAGE'] === 'granted')
    //         {
    //           setPermissionGranted(true);
    //           CameraRoll.getPhotos({first:0,assetType:'All',mimeTypes:['.png','.jpg','.mp4','.jpeg']})
    //           .then((data)=>{
    //             data.edges.forEach(edge => console.log(edge.node.image.filename))
    //           })
    //           .catch(e => console.log("camera roll err :",e))      
    //         }
    //         else{
    //           console.log("permission denied");
    //         }
    //   }).catch(err => console.log("permission error :",err))
    // }
  }

  const getMedias = async () =>{
    const album = await MediaLibrary.getAssetsAsync({
      first : 20,
      mediaType : [MediaLibrary.MediaType.photo,MediaLibrary.MediaType.video]
    })
    album.assets.forEach(asset => {
      console.log("filename :",asset.filename);
      console.log("mediaType :",asset.mediaType);
      
    })

  }
  useEffect(() => {
    requestFilePermission()
  
    return () => {
      
    }
  }, [])
  
  return (
    <>
      <PreviewTab imageUrl={previewFile}/>
    </>
  )
}

const PreviewTab : React.FC<{imageUrl : string}> = ({imageUrl})=>{

  return(
    <View>

    </View>
  )
}

export default AddNewPost

const styles = StyleSheet.create({
  
})