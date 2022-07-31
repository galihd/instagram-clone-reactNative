import React, { useEffect, useRef, useState } from 'react'
import { createStackNavigator, StackNavigationOptions, StackNavigationProp } from '@react-navigation/stack'
import { createPostStackParamList } from '../types/navtypes'
import IconButton from '../components/IconButton'
import * as MediaLibrary from 'expo-media-library'
import { CameraCapturedPicture} from 'expo-camera'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AddNewPostDetailsScreen from '../screens/Post/AddNewPostDetailsScreen'
import AddNewPostScreen from '../screens/Post/AddNewPostScreen'
import { globalStyles } from '../../AppStyle'


var stackOptions : (leftbtn? : React.ReactNode,title?: string,rightbtn? : React.ReactNode)=>StackNavigationOptions = (leftButton?,title?,rightButton?) => ({
    headerStyle:{backgroundColor:'black'},
    headerTintColor:'white',
    headerRightContainerStyle:{paddingHorizontal : 10},
    headerBackImage :  ()=>leftButton ? leftButton : <Icon name='arrow-left' style={globalStyles.headerBtn}/>,
    headerTitle : title && title,
    headerRight : ()=>rightButton ? rightButton : null,
})


const CreatePostStack = createStackNavigator<createPostStackParamList>();

const AddPostStack = () => {
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
        options={({navigation,route}) => stackOptions(<Icon name='close' style={globalStyles.headerBtn}/>,
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
        {props => <AddNewPostDetailsScreen navigation={props.navigation} handleSubmitRef={handleSubmitRef}/>}
      </CreatePostStack.Screen>
    </CreatePostStack.Navigator>
  )
}

export default AddPostStack
