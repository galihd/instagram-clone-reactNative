import { Image, Platform, SafeAreaView, StyleSheet, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import { homeStackParamList } from '../../types/navtypes'
import { StackNavigationProp } from '@react-navigation/stack'
import IconButton from '../IconButton'
import IconButtonBadged from '../iconButtonBadged'
import { Camera } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'

const Header = () => {
  const navigation = useNavigation<StackNavigationProp<homeStackParamList,"home">>();

  const createPost = async () => {
    const cameraPermissions = await Camera.requestCameraPermissionsAsync();
    const mediaLibraryPermissions = await MediaLibrary.requestPermissionsAsync();
    
    if(mediaLibraryPermissions.granted && cameraPermissions.granted){
      navigation.navigate("createPost")
    }
  }

  return (
    <View style = {styles.container}>
      <TouchableOpacity>
      <Image 
        style = {styles.logo}
        source={require("../../../assets/Instagram_header.png")}/>
      </TouchableOpacity>
      <View style={styles.iconContainer}> 
        <IconButton iconName='plus-box-outline' btnSize='large' pressFunction={()=> createPost()}/>
        <IconButton iconName='heart-outline' btnSize='medium' />
        <IconButtonBadged iconName='facebook-messenger' btnSize='medium' badgeNumber={10}/>
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container : {
      flexDirection : 'row',
      justifyContent : 'space-between',
      alignItems : 'center',
      paddingHorizontal : 15,
    },
    mainText: {
      color : 'white'
    },
    logo : {
      tintColor : 'white',
      width : 100,
      height : 50,
      resizeMode : 'stretch'
    },
    iconContainer : {
      flexDirection : 'row',
      justifyContent : 'space-around',
    }
})