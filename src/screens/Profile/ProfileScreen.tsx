import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { mainStackParamList, profileTobTabParamList} from '../../types/navtypes'
import { AppUser, FollowRelation, Post } from '../../types/modeltypes'
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
import { followAccount, setRelation, unFollowAccount } from '../../contexts/UserContexts/UserContextAction'
import { getUserFollowersByUserId, getUserFollowingByUserId } from '../../FireBase/fireStoreFunctions/followsRepo'

const {width,height} = Dimensions.get('screen')

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
  const [followRelation, setfollowRelation] = useState<FollowRelation>({followers : [],following:[]});
  const [isFollowed, setIsFollowed] = useState<boolean>(false);

  const {state,dispatch} = useUserContext();

  const navigation = useNavigation<StackNavigationProp<mainStackParamList,"profile">>()
  const {appUserId,fromHomeTab} = useRoute<RouteProp<mainStackParamList,"profile">>().params

  const isMyProfile = appUserId === state.user?.appUserId;

  
  const createPost = async () => {
    const cameraPermissions = await Camera.requestCameraPermissionsAsync();
    const mediaLibraryPermissions = await MediaLibrary.requestPermissionsAsync();
    
    if(mediaLibraryPermissions.granted && cameraPermissions.granted){
      navigation.navigate("createPost")
    }
  }

  const getProfileRelation = async () => {
    setfollowRelation ( {
      followers : await getUserFollowersByUserId(appUserId),
      following : await getUserFollowingByUserId(appUserId)
    })
  }

  const followUser = () => {
    setIsFollowed(!isFollowed)
    followAccount(state.user!.appUserId,appUserId).then(dispatch).then(getProfileRelation)
  }
  const unFollowUser = () => {
    setIsFollowed(!isFollowed)
    unFollowAccount(state.relation.following.find(follow => follow.toUserId === appUserId)!).then(dispatch).then(getProfileRelation)
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
        getProfileRelation()
        findPostsByUserId(appUserId).then(setUserPosts)
        navigation.setOptions({
          headerTitle : result.username
        })
      })

    }

    
    return () => {
      
    }
  }, [])

  useEffect(()=>{
    setIsFollowed((state.relation.following.map(follow => follow.toUserId)).includes(appUserId))
  },[followRelation])
  useEffect(()=>{
    if(isMyProfile)
      setUserPosts(state.userPosts)
  },[state.userPosts])
  
  return (
    <SafeAreaView style={globalStyles.darkContainer}>
      {(fromHomeTab) && <Header/>}
      <View style={styles.profileyContainer}>
        <Image source={{uri : isMyProfile ? state.user?.avatarUrl : userData?.avatarUrl}} style={styles.avatarImage}/>
        <View style={styles.profilexContainer}>
          <View style={styles.profilezContainer}>
            <Text style={[globalStyles.whiteTextLg,globalStyles.boldText]}>{userPosts.length}</Text>
            <Text style={[globalStyles.whiteTextSm]}>Posts</Text>
          </View>
          <View style={styles.profilezContainer}>
            <Text style={[globalStyles.whiteTextLg,globalStyles.boldText]}>
              {isMyProfile ? state.relation.followers.length : followRelation?.followers.length}
            </Text>
            <Text style={[globalStyles.whiteTextSm]}>Followers</Text>
          </View>
          <View style={styles.profilezContainer}>
            <Text style={[globalStyles.whiteTextLg,globalStyles.boldText]}>
              {isMyProfile ? state.relation.following.length : followRelation?.following.length}
            </Text>
            <Text style={[globalStyles.whiteTextSm]}>Following</Text>
          </View>
        </View>
      </View>
      <View style={[styles.profileyContainer,{paddingVertical : !isMyProfile ? 0 : 15}]}>
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
         <View>
            <Text style={[globalStyles.whiteText,globalStyles.boldText]}>
              {userData?.username}
            </Text>
            <Text style={[globalStyles.lightGreyText]}>
              {userData?.email}
            </Text>
            <Text style={[globalStyles.lightGreyText]}>
              {userData?.bio}
            </Text>
            <View style={{padding:0,width:'100%',justifyContent:'space-evenly',flexDirection:'row',alignItems:'center'}}>
              <Text style={
                [globalStyles.whiteText,
                styles.darkProfileButton,
                {
                  textAlign:'center',
                  paddingHorizontal:20,
                  paddingVertical:10,
                  flex:1,
                  marginEnd:5,
                  backgroundColor: isFollowed ? '#2A2C33' : '#4285F4'
                }]} 
                onPress={isFollowed ? unFollowUser : followUser}
                >
                {isFollowed ? <>
                  Following
                  <Icon style={[globalStyles.whiteText]} name='chevron-down'/>
                  </> : 
                'Follow'}
              </Text>
              <Text style={
                [globalStyles.whiteText,
                styles.darkProfileButton,
                {
                  textAlign:'center',
                  paddingHorizontal:20,
                  paddingVertical:10,
                  flex:1,
                  marginEnd:5
                }]} >
                Message
              </Text>

              <View style={[styles.darkProfileButton,{alignItems:'center',flexDirection:'row'}]}>
                <IconButton iconName='account-plus-outline' btnSize={'small'} />
              </View>
            </View>
          </View>
        }
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