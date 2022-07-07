import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import { homeStackParamList } from '../types/navtypes';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CommentScreen from '../screens/CommentScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconButton from '../components/IconButton';
import AddPostStack from './AddPostStack';

const HomeStack = () => {
    const homeStack = createStackNavigator<homeStackParamList>();

    var stackOptions : (leftbtn? : React.ReactNode,title?: string,rightbtn? : React.ReactNode)=>StackNavigationOptions = (leftButton?,title?,rightButton?) => ({
      headerStyle:{backgroundColor:'black'},
      headerTintColor:'white',
      headerBackImage :  ()=>leftButton ? leftButton : <IconButton iconName='arrow-left' btnSize={'large'}/>,
      headerTitle : title && title,
      headerRight : ()=>rightButton ? rightButton : null,
    })

  return (
    <homeStack.Navigator initialRouteName='home'>
        <homeStack.Screen name='home' component={HomeScreen} options={{headerShown:false}}/>
        <homeStack.Screen name='Profile' component={ProfileScreen}/>
        <homeStack.Screen name='comments' component={CommentScreen} 
          options={stackOptions(null,"Comments",<Icon name='send' style={styles.headerBtnRotate}/>)}/>
        <homeStack.Screen name='createPost'  options={{headerShown:false}}>
          {props=> <AddPostStack />}
        </homeStack.Screen>
    </homeStack.Navigator>
  )
}

export default HomeStack

const styles = StyleSheet.create({
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