import { Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native'
import React, { useEffect, useRef } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import ExploreScreen from '../screens/ExploreScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useUserContext } from '../contexts/UserContexts';
import { createStackNavigator, StackNavigationOptions, StackNavigationProp, TransitionPresets } from '@react-navigation/stack';
import { mainStackParamList, mainTabParamList, rootStackParamList } from '../types/navtypes';
import IconButton from '../components/IconButton';
import HomeScreen from '../screens/HomeScreen';
import CommentScreen from '../screens/Post/CommentScreen';
import LikesScreen from '../screens/Post/LikesScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { globalStyles } from '../../AppStyle';
import IconButtonBadged from '../components/iconButtonBadged';
import { Camera } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import { useNavigation } from '@react-navigation/native';
import PostsScreen from '../screens/Post/PostsScreen';
import {EditProfileScreen,EditProfileGalleryScreen} from '../screens/Profile/EditProfileScreen';


const mainStack = createStackNavigator<mainStackParamList>();

var commonStackOptions : (
  leftbtn? : React.ReactNode,
  title?: string | React.ReactNode,
  rightbtn? : React.ReactNode
  )=>StackNavigationOptions = (leftButton?,title?,rightButton?) => ({
    headerStyle:{backgroundColor:'black'},
    headerRightContainerStyle:{paddingHorizontal : 15},
    headerTintColor:'white',
    headerBackImage :  ()=>leftButton ? leftButton : <IconButton iconName='arrow-left' btnSize={'large'}/>,
    headerTitle : () =>title && title,
    headerRight : ()=>rightButton ? rightButton : null,
    headerMode:'screen',
    ...TransitionPresets.SlideFromRightIOS
  })

const HomeStack = () => {
  const navigation = useNavigation<StackNavigationProp<rootStackParamList,"main">>();

  const createPost = async () => {
    const cameraPermissions = await Camera.requestCameraPermissionsAsync();
    const mediaLibraryPermissions = await MediaLibrary.requestPermissionsAsync();
    
    if(mediaLibraryPermissions.granted && cameraPermissions.granted){
      navigation.navigate("createPost")
    }
  }

  return (
    <mainStack.Navigator 
      detachInactiveScreens={false}>
        <mainStack.Screen name='home' component={HomeScreen} 
        options={
          commonStackOptions(
          null,
          <TouchableHighlight>
            <Image  style={globalStyles.igLogo} source={require("../../assets/Instagram_header.png")}/>
          </TouchableHighlight>,
          <View style={globalStyles.flexRowSpaceAround}>
            <IconButton iconName='plus-box-outline' btnSize='large' pressFunction={()=> createPost()}/>
            <IconButton iconName='heart-outline' btnSize='medium' />
            <IconButtonBadged iconName='facebook-messenger' btnSize='medium' badgeNumber={10}/>
          </View>
        )}/>
        <mainStack.Screen name='profile' component={ProfileScreen} options={commonStackOptions()}/>
        <mainStack.Screen name='comments' component={CommentScreen} options={commonStackOptions(null,<Text style={globalStyles.whiteTextLg}>Comments</Text>,<Icon name='send' style={styles.headerBtnRotate}/>)}/>
        <mainStack.Screen name='likes' component={LikesScreen} options={commonStackOptions(null,<Text style={globalStyles.whiteTextLg}>Likes</Text>,null)}/>
        <mainStack.Screen name='ProfilePost' component={PostsScreen} options={commonStackOptions(null,<Text style={globalStyles.whiteTextLg}>Posts</Text>,null)}/>
    </mainStack.Navigator>
  )
}

const ProfileStack = () => {
  const {state} = useUserContext();
  return(
    <mainStack.Navigator>
      <mainStack.Screen name='profile' 
        component={ProfileScreen} 
        initialParams={{
          appUserId : state.user!.appUserId,
          fromHomeTab : true}}
        options={{...commonStackOptions(),headerShown:false}}/>

      <mainStack.Screen name='ProfilePost' component={PostsScreen} options={commonStackOptions(null,<Text style={globalStyles.whiteTextLg}>Posts</Text>,null)}/>

      <mainStack.Screen name='ProfileEdit' 
        component={EditProfileScreen}
        options={
          {...commonStackOptions(
          <IconButton iconName='close' btnSize={'large'}/>,
          <Text style={globalStyles.whiteText}>Edit Profile</Text>),
          ...TransitionPresets.RevealFromBottomAndroid
          }}/>

      <mainStack.Screen name='ProfileGallery' 
        component={EditProfileGalleryScreen}
        options={
          {...commonStackOptions(
          <IconButton iconName='close' btnSize={'large'}/>,
          <Text style={globalStyles.whiteText}>Gallery</Text>),
          ...TransitionPresets.RevealFromBottomAndroid
          }}/>

        
    </mainStack.Navigator>
  )
}


const MainNavigation = () => {
    const Tabs = createMaterialBottomTabNavigator<mainTabParamList>(); 
    const {state} = useUserContext();
  return (
    <Tabs.Navigator
      barStyle={{backgroundColor:'black'}}
      shifting={false}
      labeled = {false}
      activeColor='white'
      inactiveColor='black'
      backBehavior='history'
    >
    <Tabs.Screen name='Home' component={HomeStack} options={{
        tabBarIcon : ({color}) => <Icon name={color === 'black' ? 'home-outline' : 'home'} style={color === 'white' ? styles.barIconA : styles.barIcon}/>,
    }}/>
    <Tabs.Screen name='Search' component={ExploreScreen} options={{
        tabBarIcon : ({color}) => <Icon name={color === 'black' ? 'magnify' : 'magnify'}  style={color === 'white' ? styles.barIconA : styles.barIcon}/>,
    }}/>
    <Tabs.Screen name='Reels' component={ExploreScreen} options={{
        tabBarIcon : ({color}) => <Icon name={color === 'black' ? 'movie-open-play-outline' : 'movie-open-play'}  style={color === 'white' ? styles.barIconA : styles.barIcon}/>,
    }}/>
    <Tabs.Screen name='Shop' component={ExploreScreen} options={{
        tabBarIcon : ({color}) => <Icon name={color === 'black' ? 'shopping-outline' : 'shopping'}  style={color === 'white' ? styles.barIconA : styles.barIcon}/>,
    }}/>
    <Tabs.Screen name='Profile' component={ProfileStack} options={{
        tabBarIcon : () => <Image style={styles.imgDisplay} source={{uri : `data:image/png;base64,${state.user!.avatarUrl}`}}/>,
    }}/>
</Tabs.Navigator>
  )
}

export default MainNavigation

const styles = StyleSheet.create({
      imgDisplay : {
        width:25,
        height:25,
        borderRadius:50,
        resizeMode:'contain'
      },
      barIcon : {
          fontSize : 25,
          fontWeight : '100',
          color : 'white'
      },
      barIconA: {
          fontSize : 28,
          fontWeight : '300',
          color : 'white'
      },
      headerBtnRotate : {
        fontSize : 20,
        color:'white',
        marginRight:15,
        transform : [{rotate :'-50deg'}]
      }
})