import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { rootStackParamList } from '../../types/navtypes';
import { useUserContext } from '../../contexts/UserContexts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconButton from '../IconButton';

const Header = () => {
    const {state,dispatch} = useUserContext();
    const navigation = useNavigation<StackNavigationProp<rootStackParamList>>()
    const createPost = async () => {
        const cameraPermissions = await Camera.requestCameraPermissionsAsync();
        const mediaLibraryPermissions = await MediaLibrary.requestPermissionsAsync();
        
        if(mediaLibraryPermissions.granted && cameraPermissions.granted){
          navigation.navigate("createPost")
        }
      }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{...styles.container,paddingHorizontal:0,paddingVertical:5}}>
        <Text style={[styles.mainText,styles.boldText]}>{state.user?.username}</Text>
        <Icon style={[styles.mainText,styles.boldText]} name='chevron-down'/>
      </TouchableOpacity>
      <View style={{...styles.container,paddingHorizontal:0,paddingVertical:5}}>
        <IconButton iconName='plus-box-outline' btnSize={'large'} pressFunction={createPost}/>
        <IconButton iconName='reorder-horizontal' btnSize={'large'} />
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
        paddingVertical:3
      },
      mainText: {
        color : 'white',
        textAlignVertical : 'center'
      },
      boldText: {
        fontWeight:'500',
        fontSize:25
      }
})