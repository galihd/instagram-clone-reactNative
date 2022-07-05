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
  }

  const getMedias = async () =>{
    const pagedAssets = await MediaLibrary.getAssetsAsync({
      first : 20,
      mediaType : [MediaLibrary.MediaType.photo,MediaLibrary.MediaType.video]
    })
    console.log(pagedAssets.endCursor);
    
    // console.log("album hasnext :",album.hasNextPage);
    
    // album.assets.forEach(asset => {
    //   console.log("mediaType :",asset.mediaType);
    //   console.log("uri :",asset.uri);
    // })

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