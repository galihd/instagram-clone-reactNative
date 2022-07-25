import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { mainStackParamList, profileTobTabParamList, rootStackParamList } from '../../types/navtypes'
import { AppUser, Post } from '../../types/modeltypes'
import { useUserContext } from '../../contexts/UserContexts'
import { findAppUserById } from '../../FireBase/fireStoreFunctions/usersRepo'
import { findPostsByUserId } from '../../FireBase/fireStoreFunctions/postsRepo'
import Header from '../../components/Profile/Header'
import IconButton from '../../components/IconButton'
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import PostsTab from '../../components/Profile/PostsTab'
import { globalStyles } from '../../../AppStyle'

const {width,height} = Dimensions.get('window')

const profileTopBar = createMaterialTopTabNavigator<profileTobTabParamList>();

const UserTagTab = () => {
  return(
    <View>
      <Text>TAG TAB</Text>
    </View>
  )
}

const UserReelsTab = () => {
  return(
    <View>
      <Text>REELS TAB</Text>
    </View>
  )
}

const ProfileScreen = () => {
  const [userData, setuserData] = useState<AppUser>();
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  const {state,dispatch} = useUserContext();

  const rootNavigation = useNavigation<StackNavigationProp<rootStackParamList,"main">>();
  const navigation = useNavigation<StackNavigationProp<mainStackParamList,"profile">>()
  const {appUserId,fromHomeTab} = useRoute<RouteProp<mainStackParamList,"profile">>().params

  const isMyProfile = appUserId === state.user?.appUserId;

  const fetchUserPosts = () => {
    findPostsByUserId(appUserId)
      .then(result => setUserPosts(result))
  }
  
  const createPost = async () => {
    const cameraPermissions = await Camera.requestCameraPermissionsAsync();
    const mediaLibraryPermissions = await MediaLibrary.requestPermissionsAsync();
    
    if(mediaLibraryPermissions.granted && cameraPermissions.granted){
      rootNavigation.navigate("createPost")
    }
  }

  useEffect(() => {
    if(appUserId === state.user?.appUserId){
      setuserData(state.user)
      if(!fromHomeTab){
        navigation.setOptions({
          headerRight : () =><Icon name='plus-box-outline' style={{fontSize:30,color:'white'}} onPress={createPost}/>,
          headerTitle : state.user.username
        })
      }
    }else{
      findAppUserById(appUserId).then(result => {
        setuserData(result)
        navigation.setOptions({
          headerTitle : result.username
        })
      })
    }

    fetchUserPosts();
  
    return () => {
      
    }
  }, [])
  
  
  return (
    <SafeAreaView style={globalStyles.darkContainer}>
      {(fromHomeTab) && <Header/>}
      <View style={styles.profileyContainer}>
        <Image source={{uri : (isMyProfile) ? 
        `data:image/png;base64,${userData?.avatarUrl}` : userData?.avatarUrl}} style={styles.avatarImage}/>
        <View style={styles.profilexContainer}>
          <View style={styles.profilezContainer}>
            <Text style={[globalStyles.whiteTextLg,globalStyles.boldText]}>{userPosts.length}</Text>
            <Text style={[globalStyles.whiteTextSm]}>Posts</Text>
          </View>
          <View style={styles.profilezContainer}>
            <Text style={[globalStyles.whiteTextLg,globalStyles.boldText]}>{userPosts.length}</Text>
            <Text style={[globalStyles.whiteTextSm]}>Followers</Text>
          </View>
          <View style={styles.profilezContainer}>
            <Text style={[globalStyles.whiteTextLg,globalStyles.boldText]}>{userPosts.length}</Text>
            <Text style={[globalStyles.whiteTextSm]}>Following</Text>
          </View>
        </View>
      </View>
      <View style={styles.profileyContainer}>
        {isMyProfile ? 
        <>
          <TouchableOpacity 
            onPress={()=>navigation.navigate('ProfileEdit',{})}
            style={[styles.profilexContainer,styles.buttonPadding,styles.darkProfileButton,{marginEnd:5}]}>
            <Text style={[globalStyles.whiteText]} >Edit profile</Text>
          </TouchableOpacity>
          <View style={styles.darkProfileButton}>
            <IconButton iconName='account-plus-outline' btnSize={'small'} />
          </View>
        </> : 
        <>
        
        </>}
      </View>
      <profileTopBar.Navigator 
        screenOptions={{
          tabBarStyle:{
            backgroundColor : 'black',
            alignContent:'center',
            alignSelf:'center',
            width:width
          },
          tabBarActiveTintColor : 'white',
          tabBarInactiveTintColor : '#686868',
          tabBarShowLabel:false,
          tabBarIndicatorStyle : {backgroundColor:'white'}
        }}
      >
        <profileTopBar.Screen name='userPosts'
          options={{
            tabBarIcon : ({color}) =><Icon name='grid' style={{fontSize:25,color : color}}/>
          }}>
            {props => <PostsTab userPosts={userPosts}/>}
          </profileTopBar.Screen>
        <profileTopBar.Screen name='userReels' component={UserReelsTab}
          options={{
            tabBarIcon : ({color}) =><Icon name='movie-open-play-outline' style={{fontSize:25,color : color}}/>
          }}/>
        <profileTopBar.Screen name='userTagged' component={UserTagTab}
          options={{
            tabBarIcon : ({color}) =><Icon name='camera-account' style={{fontSize:25,color : color}}/>
          }}/>
      </profileTopBar.Navigator>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  profileyContainer : {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    padding:15
  },
  profilexContainer:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center'
  },
  profilezContainer:{
    alignItems:'center',
    justifyContent:'center',
    width:width/5,
    marginHorizontal:5
  },
  avatarImage:{
    width:80,
    height:80,
    borderRadius : 50
  },
  darkProfileButton : {
    backgroundColor : '#2A2C33',
    borderRadius:8,
    height:'100%'
  },
  buttonPadding : {
    padding : 5,
    paddingHorizontal: 10,
  }

})