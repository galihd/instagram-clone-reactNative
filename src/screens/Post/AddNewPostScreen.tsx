import { Image,View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import {Camera, CameraCapturedPicture} from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import {CameraCapturer,GallerySelector} from '../../components/Post'
import { globalStyles } from '../../../AppStyle'

const AddNewPostScreen : React.FC<{
  assets : Array<MediaLibrary.Asset>,
  selectedFilesState : MediaLibrary.Asset[] | CameraCapturedPicture[] | undefined,
  selectFiles : React.Dispatch<React.SetStateAction<MediaLibrary.Asset[] | CameraCapturedPicture[] | undefined>>
}> = 
({assets,selectedFilesState,selectFiles}) => {
  const cameraRef = useRef<Camera | null>();
  const [capturedPicture, setCapturedPicture] = useState<CameraCapturedPicture>();
  const [postingMode, setPostingMode] = useState<"cameraActive" | "previewCapture" | "gallery">("gallery");

  
  const captureCamera = async () =>{
    let photo = await cameraRef.current?.takePictureAsync();
    if(photo){
      selectFiles([photo]);
      setCapturedPicture(photo);
      setPostingMode("previewCapture");
    }
  }
  
  return (
    <View style={globalStyles.darkContainer}>
      {
        postingMode === "cameraActive" ?
          <CameraCapturer 
            thumbnailAsset={assets[0]} 
            cameraRef = {cameraRef}
            captureFunction={captureCamera}
            closeFunction={()=>setPostingMode("gallery")}/>
      : postingMode === 'previewCapture' ? 
          <View>
            <Image source={{uri : capturedPicture?.uri}} style={globalStyles.imgFullScreen}/>
          </View> 
      : postingMode === 'gallery' &&
          <GallerySelector 
            assets={assets} 
            selectedFilesState={selectedFilesState} 
            setSelectFileFunction={selectFiles}
            closeFunction={()=>setPostingMode("cameraActive")}
            />
      }
    </View>
  )
}


export default AddNewPostScreen