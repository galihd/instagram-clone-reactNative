import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library'
import { CommonActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { mainStackParamList, rootStackParamList } from '../../types/navtypes';
import { useUserContext } from '../../contexts/UserContexts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconButton from '../IconButton';
import BottomDrawer from '../BottomDrawer';
import { globalStyles } from '../../../AppStyle';
import { loadUsersDataFromStorage, setRelation, signIn} from '../../contexts/UserContexts/UserContextAction';
import { AppUser } from '../../types/modeltypes';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const [switchDrawerOpen, setSwitchDrawerOpen] = useState(false)
  const [existingUsers, setExistingUsers] = useState<AppUser[]>([])
  
  const {state,dispatch} = useUserContext();
  const navigation = useNavigation<StackNavigationProp<rootStackParamList,"main">>()
  const mainNavigation = useNavigation<StackNavigationProp<mainStackParamList,"profile">>();
  const createPost = async () => {
      const cameraPermissions = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermissions = await MediaLibrary.requestPermissionsAsync();
      
      if(mediaLibraryPermissions.granted && cameraPermissions.granted){
        mainNavigation.navigate("createPost")
      }
    }
  
  const switchSignIn = () => {
    setDrawerOpen(false)
    setSwitchDrawerOpen(false)
    navigation.navigate('signIn')
  }

  const switchActiveAccount = (signedUser : AppUser) => {
    setDrawerOpen(false)
    setSwitchDrawerOpen(false)

    signIn(signedUser)
      .then(dispatch)
    navigation.dispatch(CommonActions.reset({
      index : 1,
      routes : [{name : 'main'}]
    }))
  }

  useEffect(() => {
    async function setUsers() {
      setExistingUsers(await loadUsersDataFromStorage())
    }
    setUsers();
  
    return () => {
      
    }
  }, [])
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={()=>{setSwitchDrawerOpen(true)}}
        style={{...styles.container,paddingHorizontal:0,paddingVertical:5}}>
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
          <IconButton btnSize={'medium'} iconName='account-convert' pressFunction={()=>setSwitchDrawerOpen(true)}><Text style={globalStyles.whiteText}>Switch account</Text></IconButton> 
        </BottomDrawer>
      }
      {
        switchDrawerOpen&&
        <BottomDrawer size='small' isOpen={switchDrawerOpen} closeFuntion={()=>setSwitchDrawerOpen(false)}>
          {
            existingUsers.map((user,index) => 
            <TouchableOpacity 
              onPress={()=>{(user.appUserId != state.user?.appUserId) && switchActiveAccount(user)} }
              key={user.appUserId} 
              style={[globalStyles.flexRowSpaceAround,{justifyContent:'flex-start',padding:5}]}>
              <Image source={{uri : user.avatarUrl}} style={{width:50,height:50,borderRadius:50,marginEnd:10}}/>
              <Text style={(state.user?.appUserId === user.appUserId) ? globalStyles.linkText : globalStyles.whiteText}>
                {user.username}
              </Text>
            </TouchableOpacity>)
          }
          <View style={{width:'100%',height:StyleSheet.hairlineWidth,backgroundColor:'white'}}></View>
          <View style={[globalStyles.flexRowSpaceAround,{padding:5}]}>
            <IconButton btnSize={'large'} iconName='plus-circle-outline' pressFunction={switchSignIn}>
              <Text style={globalStyles.whiteText} >Add account</Text>
            </IconButton>
          </View>
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