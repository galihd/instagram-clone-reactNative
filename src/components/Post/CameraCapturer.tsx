import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

import {Camera, CameraType} from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import IconButton from '../IconButton';

const {width} = Dimensions.get('window');

const CameraCapturer : React.FC<{
        thumbnailAsset? : MediaLibrary.Asset,
        cameraRef : React.MutableRefObject<Camera | null | undefined>,
        captureFunction : ()=>Promise<void>,
        closeFunction : ()=>void
    }> = ({thumbnailAsset,cameraRef,captureFunction,closeFunction}) => {
    
    const [activeCameraType, setActiveCameraType] = useState<CameraType.front | CameraType.back>(CameraType.back);

    const switchCameraType = () => {
        if(activeCameraType === CameraType.front){
          setActiveCameraType(CameraType.back);
        }else{
          setActiveCameraType(CameraType.front);
        }
      }
  return (
    <Camera ref={(camera)=>{cameraRef.current = camera}} 
            type={activeCameraType} 
            style={styles.cameraContainer}
            ratio={'16:9'}>
      <View style={{position: 'absolute',top : 30,right:width/2-15}}>
        <IconButton iconName='flash' btnSize='large'/>
      </View>
            
      <View style={{marginTop:'auto',flexDirection:'row',alignItems:'flex-end',justifyContent:'center',padding:15}}>
        <View style={{marginLeft:'auto',position:'absolute',padding:15}}>
          <IconButton iconName='circle-outline' btnSize={100} pressFunction={captureFunction}/>
        </View>
        <TouchableOpacity style={{backgroundColor:'white',padding:2,marginRight:'auto'}} onPress={closeFunction}>
          <Image source={{uri: thumbnailAsset!.uri}} style={{width:35,height:35,resizeMode:'cover'}}/>
        </TouchableOpacity>
        <View style={{marginLeft:'auto'}}>
          <IconButton iconName='camera-flip' btnSize='large' pressFunction={switchCameraType}/>
        </View>
      </View>
    </Camera> 
  )
}

export default CameraCapturer

const styles = StyleSheet.create({
    cameraContainer : {
        width : "100%",
        height : "100%"
    }
})