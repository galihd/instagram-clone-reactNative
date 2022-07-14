import { Image, StyleSheet} from 'react-native'
import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useUserContext } from '../contexts/UserContexts';
import { createStackNavigator, StackNavigationOptions, TransitionPresets } from '@react-navigation/stack';
import { mainStackParamList } from '../types/navtypes';
import IconButton from '../components/IconButton';
import HomeScreen from '../screens/HomeScreen';
import CommentScreen from '../screens/Post/CommentScreen';
import LikesScreen from '../screens/Post/LikesScreen';
import AddPostStack from './AddPostStack';


const mainStack = createStackNavigator<mainStackParamList>();

var commonStackOptions : (leftbtn? : React.ReactNode,title?: string,rightbtn? : React.ReactNode)=>StackNavigationOptions = (leftButton?,title?,rightButton?) => ({
    headerStyle:{backgroundColor:'black'},
    headerTintColor:'white',
    headerBackImage :  ()=>leftButton ? leftButton : <IconButton iconName='arrow-left' btnSize={'large'}/>,
    headerTitle : title && title,
    headerRight : ()=>rightButton ? rightButton : null,
  })

var createPostStackOptions : StackNavigationOptions = 
    {
      headerShown:false,
      ...TransitionPresets.SlideFromRightIOS,
      gestureDirection:'horizontal-inverted'
    }

const HomeStack = () => {
  return (
    <mainStack.Navigator initialRouteName='home'>
        <mainStack.Screen name='home' component={HomeScreen} options={{headerShown:false}}/>
        <mainStack.Screen name='createPost' component={AddPostStack}  options={createPostStackOptions}/>
        <mainStack.Screen name='Profile' component={ProfileStack}/>
        <mainStack.Screen name='comments' component={CommentScreen} options={commonStackOptions(null,"Comments",<Icon name='send' style={styles.headerBtnRotate}/>)}/>
        <mainStack.Screen name='likes' component={LikesScreen} options={commonStackOptions(null,'Likes',null)}/>
    </mainStack.Navigator>
  )
}

const ProfileStack = () => {
    return(
    <mainStack.Navigator>
        <mainStack.Screen name='Profile' component={ProfileScreen}/>
    </mainStack.Navigator>
    )
}


const MainNavigation = () => {
    const Tabs = createMaterialBottomTabNavigator(); 
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
    <Tabs.Screen name='Profile' component={ProfileScreen} initialParams={{appUserId : state.user!.appUserId}} options={{
        tabBarIcon : ({color}) => 
        <Image style={styles.imgDisplay} source={{uri : `data:image/png;base64,${state.user!.avatarUrl}`}}/>,
    }}/>
</Tabs.Navigator>
  )
}

export default MainNavigation

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
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
      commentHeader : {
        backgroundColor : 'black',
        color: 'white'
      },
      headerBtnRotate : {
        fontSize : 20,
        color:'white',
        marginRight:15,
        transform : [{rotate :'-50deg'}]
      }
})