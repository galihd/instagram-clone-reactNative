import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { createPostStackParamList } from '../types/navtypes'
import * as MediaLibrary from 'expo-media-library'
import { CameraCapturedPicture } from 'expo-camera'


const AddNewPostDetailsScreen = () => {
  const routeProp = useRoute<RouteProp<createPostStackParamList,"postDetails">>();
  const {uri,...rest} =  (routeProp.params.selectedFiles as Array<MediaLibrary.Asset>)[0]; 
  if(uri){
    console.log(uri);
    
  }
  return (
    <View>
      {uri && <Image source={{uri : uri}} style={{width:100,height:100}}/>}
    </View>
  )
}

export default AddNewPostDetailsScreen

const styles = StyleSheet.create({})