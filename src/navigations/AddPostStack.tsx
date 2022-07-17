import React, { useEffect, useRef, useState } from 'react'
import { createStackNavigator, StackNavigationOptions, StackNavigationProp } from '@react-navigation/stack'
import { createPostStackParamList } from '../types/navtypes'
import IconButton from '../components/IconButton'
import { useNavigation } from '@react-navigation/native'
import * as MediaLibrary from 'expo-media-library'
import { CameraCapturedPicture} from 'expo-camera'

import AddNewPostDetailsScreen from '../screens/Post/AddNewPostDetailsScreen'
import AddNewPostScreen from '../screens/Post/AddNewPostScreen'


var stackOptions : (leftbtn? : React.ReactNode,title?: string,rightbtn? : React.ReactNode)=>StackNavigationOptions = (leftButton?,title?,rightButton?) => ({
    headerStyle:{backgroundColor:'black'},
    headerTintColor:'white',
    headerRightContainerStyle:{paddingHorizontal : 10},
    headerBackImage :  ()=>leftButton ? leftButton : <IconButton iconName='arrow-left' btnSize={'large'}/>,
    headerTitle : title && title,
    headerRight : ()=>rightButton ? rightButton : null,
})


const AddPostStack = () => {
    const CreatePostStack = createStackNavigator<createPostStackParamList>();
    const navigation = useNavigation<StackNavigationProp<createPostStackParamList,"addNewPost">>();
    const [assets, setAssets] = useState<Array<MediaLibrary.Asset>>([])
    const [selectedFiles, setselectedFiles] = useState<Array<MediaLibrary.Asset> | Array<CameraCapturedPicture>>();

    const handleSubmitRef = useRef<(e?: React.FormEvent<HTMLFormElement> | undefined) => void>();
  
    const getMedias = async () =>{
      const pagedAssets = await MediaLibrary.getAssetsAsync({
        first : 20,
        mediaType : [MediaLibrary.MediaType.photo,MediaLibrary.MediaType.video]
      })
      setAssets(pagedAssets.assets);
    }

    const createPost = ()=>{
      handleSubmitRef.current!()
    }
  
    useEffect(() => {
      getMedias()
    
      return () => {
        
      }
    }, [])



  return (
    <CreatePostStack.Navigator initialRouteName='addNewPost'>
      <CreatePostStack.Screen name='addNewPost' 
        options={stackOptions(<IconButton iconName='close' btnSize={'large'}/>,
          "New Post",
          selectedFiles &&
          <IconButton 
            iconName='arrow-right' 
            btnSize={'large'}  
            pressFunction={()=>{navigation.navigate('postDetails',{selectedFiles : selectedFiles})}}
            />)
          }>
            {props => <AddNewPostScreen assets={assets} selectedFilesState={selectedFiles} selectFiles={setselectedFiles}/>}
      </CreatePostStack.Screen>

      <CreatePostStack.Screen name='postDetails'
        initialParams={{selectedFiles : selectedFiles}}
        options={
          stackOptions(null,"Post Details",
          <IconButton 
            iconName='check' 
            btnSize={'large'}
            pressFunction={()=>createPost()}
          />
          )}>
        {props => <AddNewPostDetailsScreen handleSubmitRef={handleSubmitRef}/>}
      </CreatePostStack.Screen>
    </CreatePostStack.Navigator>
  )
}

export default AddPostStack
