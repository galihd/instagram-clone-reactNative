import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { rootStackParamList } from '../../types/navtypes';
import { useUserContext } from '../../contexts/UserContexts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconButton from '../IconButton';
import BottomDrawer from '../BottomDrawer';
import { globalStyles } from '../../../AppStyle';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
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
        <IconButton iconName='reorder-horizontal' btnSize={'large'} pressFunction={()=>{setDrawerOpen(true)}}/>
      </View>
      {
      drawerOpen && 
        <BottomDrawer isOpen={drawerOpen} closeFuntion={()=> setDrawerOpen(false)}>
          <IconButton btnSize={'medium'} iconName='cog'><Text style={globalStyles.whiteText}>Settings</Text></IconButton> 
          <IconButton btnSize={'medium'} iconName='history'><Text style={globalStyles.whiteText}>Archive</Text></IconButton> 
          <IconButton btnSize={'medium'} iconName='progress-clock'><Text style={globalStyles.whiteText}>Your activity</Text></IconButton> 
          <IconButton btnSize={'medium'} iconName='qrcode-scan'><Text style={globalStyles.whiteText}>QR Code</Text></IconButton> 
          <IconButton btnSize={'medium'} iconName='bookmark-outline'><Text style={globalStyles.whiteText}>Saved</Text></IconButton> 
          <IconButton btnSize={'medium'} iconName='playlist-star'><Text style={globalStyles.whiteText}>Close friends</Text></IconButton> 
          <IconButton btnSize={'medium'} iconName='star-outline'><Text style={globalStyles.whiteText}>Favourites</Text></IconButton> 
          <IconButton btnSize={'medium'} iconName='facebook-messenger'><Text style={globalStyles.whiteText}>Update messaging</Text></IconButton> 
        </BottomDrawer>
      }
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