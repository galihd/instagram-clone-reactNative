import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import {Camera, CameraCapturedPicture} from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import * as Yup from 'yup'
import {Formik} from 'formik'

import IconButton from '../components/IconButton';
import CameraCapturer from '../components/PostCreation/CameraCapturer'
import GallerySelector from '../components/PostCreation/GallerySelector'

const {width,height} = Dimensions.get('window')

const AddNewPostScreen : React.FC<{
  assets : Array<MediaLibrary.Asset>,
  selectedFilesState : MediaLibrary.Asset[] | CameraCapturedPicture | undefined,
  selectFiles : React.Dispatch<React.SetStateAction<MediaLibrary.Asset[] | CameraCapturedPicture | undefined>>
}> = 
({assets,selectedFilesState,selectFiles}) => {
  const cameraRef = useRef<Camera | null>();
  const [capturedPicture, setCapturedPicture] = useState<CameraCapturedPicture>();
  const [postingMode, setPostingMode] = useState<"cameraActive" | "previewCapture" | "gallery">("gallery");

  
  const captureCamera = async () =>{
    let photo = await cameraRef.current?.takePictureAsync();
    if(photo){
      setCapturedPicture(photo);
      setPostingMode("previewCapture");
      selectFiles(photo);
    }
  }
  
  return (
    <View style={styles.MainContainer}>
      {
        postingMode === "cameraActive" ?
          <CameraCapturer 
            thumbnailAsset={assets[0]} 
            cameraRef = {cameraRef}
            captureFunction={captureCamera}
            closeFunction={()=>setPostingMode("gallery")}/>
      : postingMode === 'previewCapture' ? 
          <View>
            <Image source={{uri : capturedPicture?.uri}} style={styles.capturedPicture}/>
          </View> 
      : postingMode === 'gallery' &&
          <GallerySelector 
            assets={assets} 
            selectedFilesState={selectedFilesState} 
            selectFileFunction={selectFiles}
            closeFunction={()=>setPostingMode("cameraActive")}
            />
      }
    </View>
  )
}


export default AddNewPostScreen

const styles = StyleSheet.create({
    MainContainer : {
      flex:1,
      justifyContent:'center',
      alignItems:'center'
    },
    capturedPicture : {
      width : width,
      height : height,
      resizeMode : 'cover'
    }
})