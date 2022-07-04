import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import { homeStackParamList } from '../types/navtypes';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CommentScreen from '../screens/CommentScreen';
import Icon from 'react-native-vector-icons/MaterialIcons'
import AddNewPost from '../screens/AddNewPost';

const HomeStack = () => {
    const homeStack = createStackNavigator<homeStackParamList>();

    var stackOptions : (r? : React.ReactNode,t?: string)=>StackNavigationOptions = (rightButton,title) => ({
      headerStyle:{backgroundColor:'black'},
      headerTitleStyle : {color:'white'},
      headerTintColor:'white',
      headerRight : ()=>rightButton,
      headerTitle : title && title
    })

  return (
    <homeStack.Navigator >
        <homeStack.Screen name='home' component={HomeScreen} options={{headerShown:false}}/>
        <homeStack.Screen name='Profile' component={ProfileScreen}/>
        <homeStack.Screen name='comments' component={CommentScreen} options={stackOptions(<Icon name='send' style={styles.headerBtn}></Icon>,"Comments")}/>
        <homeStack.Screen name='addNewPost' component={AddNewPost} options={stackOptions(null,"New Post")}/>
    </homeStack.Navigator>
  )
}

export default HomeStack

const styles = StyleSheet.create({
  commentHeader : {
    backgroundColor : 'black',
    color: 'white'
  },
  headerBtn : {
    fontSize : 20,
    color:'white',
    marginRight:15,
    transform : [{rotate :'-50deg'}]
  }
})