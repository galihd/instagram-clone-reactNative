import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import {Camera, CameraCapturedPicture, CameraType} from 'expo-camera'
import { ScrollView} from 'react-native-gesture-handler'
import * as MediaLibrary from 'expo-media-library'
import * as Yup from 'yup'
import {Formik} from 'formik'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconButton from '../components/IconButton';


const {width,height} = Dimensions.get('window');

const AddNewPost : React.FC<{
  selectFiles : React.Dispatch<React.SetStateAction<MediaLibrary.Asset | MediaLibrary.Asset[] | CameraCapturedPicture | undefined>>
}> = 
({selectFiles}) => {
  const cameraRef = useRef<Camera | null>();
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [activeCameraType, setActiveCameraType] = useState<CameraType.front | CameraType.back>(CameraType.front);
  const [assets, setAssets] = useState<Array<MediaLibrary.Asset>>([])
  const [previewFile, setPreviewFile] = useState<MediaLibrary.Asset>();
  const [allowMultiple, setAllowMultiple] = useState<boolean>(false);
  

  const requestFilePermission = async () => {
    const cameraPermissions = await Camera.requestCameraPermissionsAsync();
    const mediaLibraryPermissions = await MediaLibrary.requestPermissionsAsync();
    
    if(mediaLibraryPermissions.granted && cameraPermissions.granted){
      getMedias();
    }
  }

  const getMedias = async () =>{
    const pagedAssets = await MediaLibrary.getAssetsAsync({
      first : 20,
      mediaType : [MediaLibrary.MediaType.photo,MediaLibrary.MediaType.video]
    })
    setAssets(pagedAssets.assets);
  }

  const captureCamera = async () =>{
    let photo = await cameraRef.current?.takePictureAsync();
    if(photo){
      selectFiles(photo);
    }
  }

  const switchCameraType = () => {
    if(activeCameraType === CameraType.front){
      setActiveCameraType(CameraType.back);
    }else{
      setActiveCameraType(CameraType.front);
    }
  }

  const touchFileHandler = (file : MediaLibrary.Asset) =>{
    setPreviewFile(file as MediaLibrary.Asset);
    if(allowMultiple){
      selectFiles(prev => [...prev as Array<MediaLibrary.Asset>,file])
    }else{
      selectFiles(file);
    }
  }

  useEffect(() => {
    requestFilePermission()
  
    return () => {
      
    }
  }, [])
  
  return (
    <View style={styles.MainContainer}>
      {
        cameraActive ?
          <Camera ref={(camera)=>{cameraRef.current = camera}} 
            type={activeCameraType} 
            style={styles.cameraContainer}
            ratio={'16:9'}>
            <View style={{position: 'absolute',top : 30,right:width/2-15}}>
              <IconButton iconName='flash' btnSize='large' pressFunction={()=>setCameraActive(false)}/>
            </View>
            
            <View style={{marginTop:'auto',flexDirection:'row',alignItems:'flex-end',justifyContent:'center',padding:15}}>
              <View style={{marginLeft:'auto',position:'absolute',padding:15}}>
                <IconButton iconName='circle-outline' btnSize={100} pressFunction={captureCamera}/>
              </View>
              <TouchableOpacity style={{backgroundColor:'white',padding:2,marginRight:'auto'}} onPress={()=>setCameraActive(false)}>
                <Image source={{uri: assets[0].uri}} style={{width:35,height:35,resizeMode:'cover'}}/>
              </TouchableOpacity>
              <View style={{marginLeft:'auto'}}>
                <IconButton iconName='camera-flip' btnSize='large' pressFunction={switchCameraType}/>
              </View>
            </View>
          </Camera> 
          :
          <>
          <PreviewTab previewFile={previewFile}/>
          <View style={styles.utilityBar}>
            <View style={{backgroundColor: allowMultiple ? 'grey' : 'black'}}>
              <IconButton iconName='card-multiple' btnSize='medium' pressFunction={()=>setAllowMultiple(!allowMultiple)}>
                <Text style={{color:'white',marginRight:25,fontSize:10}}>SELECT MULTIPLE</Text>
              </IconButton>
            </View>
            <IconButton iconName='camera' btnSize='medium' pressFunction={()=>setCameraActive(true)}/>
          </View>

          {assets && 
            <ScrollView style={styles.GridContainer} contentContainerStyle={styles.GridContentContainert}>
              {assets.map((file,idx) => 
                <TouchableHighlight key={idx} onPress={()=>touchFileHandler(file)}>
                  {
                    file.mediaType === 'photo' ?
                    <Image source={{uri : file.uri}} style={styles.GridImage}/> :
                    <View>
                      <Image source={{uri : file.uri}} style={styles.GridImage}/> 
                      <Icon name='play-outline' style={styles.GridVideoBadge}/>
                    </View>

                  }
                </TouchableHighlight>
              )}
            </ScrollView>
          }
        </>
      }
    </View>
  )
}

const PreviewTab : React.FC<{previewFile : MediaLibrary.Asset | undefined}> = ({previewFile})=>{
  return(
    <View style={styles.PreviewContainer}>
      {
        previewFile?.mediaType === 'photo' ?
        <Image source={{uri : previewFile!.uri}} style={{width:'100%',height:'100%',resizeMode:'contain'}} />
        :
        <View>
          {/* TO DO : PLAYING VIDEOS PREVIEW */}
        </View>
      }
    </View>
  )
}

export default AddNewPost

const styles = StyleSheet.create({
    MainContainer : {
      flex:1,
      justifyContent:'center',
      alignItems:'center'
    },
    GridContainer:{

    },
    GridContentContainert : {
      flexDirection:'row',
      flexWrap:'wrap',
      backgroundColor : 'black'
    },
    GridImage : {
      width : width/3,
      height: width/3,
      resizeMode:'contain'
    },
    GridVideoBadge:{
      position:'absolute',
      top:3,
      right:3,
      fontSize:40,
      fontWeight:'600',
    },
    PreviewContainer : {
      height : height/2,
      width : width
    },
    utilityBar:{
      flexDirection:'row',
      backgroundColor :'black',
      justifyContent:'flex-end',
      alignItems:'center',
      width:'100%',
      paddingHorizontal:20,
      paddingVertical:5
    },
    cameraContainer : {
      width : "100%",
      height : "100%"
    }
})