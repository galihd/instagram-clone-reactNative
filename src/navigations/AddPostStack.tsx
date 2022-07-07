import { StyleSheet, Text, View} from 'react-native'
import React, { useState } from 'react'
import { createStackNavigator, StackNavigationOptions, StackNavigationProp } from '@react-navigation/stack'
import { createPostStackParamList } from '../types/navtypes'
import IconButton from '../components/IconButton'
import { useNavigation } from '@react-navigation/native'
import * as MediaLibrary from 'expo-media-library'
import {CameraCapturedPicture} from 'expo-camera'
import AddNewPostScreen from '../screens/AddNewPostScreen'

const AddPostStack = () => {
    const CreatePostStack = createStackNavigator<createPostStackParamList>();
    const navigation = useNavigation<StackNavigationProp<createPostStackParamList,"addNewPost">>();
    const [selectedFiles, setselectedFiles] = useState<Array<MediaLibrary.Asset> | MediaLibrary.Asset | CameraCapturedPicture>();

    var stackOptions : (leftbtn? : React.ReactNode,title?: string,rightbtn? : React.ReactNode)=>StackNavigationOptions = (leftButton?,title?,rightButton?) => ({
        headerStyle:{backgroundColor:'black'},
        headerTintColor:'white',
        headerBackImage :  ()=>leftButton ? leftButton : <IconButton iconName='arrow-left' btnSize={'large'}/>,
        headerTitle : title && title,
        headerRight : ()=>rightButton ? rightButton : null,
      })

  return (
    <CreatePostStack.Navigator initialRouteName='addNewPost'>
      <CreatePostStack.Screen name='addNewPost' 
        options={stackOptions(<IconButton iconName='close' btnSize={'large'}/>,
          "New Post",
          <IconButton 
            iconName='arrow-right' 
            btnSize={'large'}  
            pressFunction={()=>{navigation.navigate('postDetails',{selectedFiles : selectedFiles})}}
            />)
          }>
            {props => <AddNewPostScreen selectFiles={setselectedFiles}/>}
      </CreatePostStack.Screen>

      
    </CreatePostStack.Navigator>
  )
}

export default AddPostStack

const styles = StyleSheet.create({})