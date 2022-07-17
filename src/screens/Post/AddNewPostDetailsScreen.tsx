import { Image, StyleSheet, Switch, Text, TextInput, TouchableHighlight, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { createPostStackParamList, rootStackParamList } from '../../types/navtypes'
import * as MediaLibrary from 'expo-media-library'
import {Formik, FormikHelpers} from 'formik'
import * as Yup from 'yup'
import { useUserContext } from '../../contexts/UserContexts'
import { AppUser, Post } from '../../types/modeltypes'
import { createPost } from '../../FireBase/fireStoreFunctions/postsRepo'
import { globalStyles } from '../../../AppStyle'
import { StackNavigationProp } from '@react-navigation/stack'


interface createPostInterface {
  caption : string,
  taggedPeople : Array<string>
}
const initialValues : createPostInterface = {
  caption : '',
  taggedPeople : []
}

const schema = Yup.object({
  caption : Yup.string().max(50)
})

const AddNewPostDetailsScreen : React.FC<{
  handleSubmitRef : React.MutableRefObject<((e?: React.FormEvent<HTMLFormElement> | undefined) => void) | undefined>
}> = ({handleSubmitRef}) => {
  const [faceBookPost, setfaceBookPost] = useState<boolean>(false)
  const [twitterPost, settwitterPost] = useState<boolean>(false)
  const [tumblrPost, settumblrPost] = useState<boolean>(false)

  const navigation = useNavigation<StackNavigationProp<rootStackParamList,"createPost">>();
  const {state} = useUserContext();
  const routeProp = useRoute<RouteProp<createPostStackParamList,"postDetails">>();
  const {selectedFiles} = routeProp.params
  const {uri,...rest} =  (selectedFiles as Array<MediaLibrary.Asset>)[0]; 

  const uploadPost = (values : createPostInterface, helpers : FormikHelpers<createPostInterface>) => {
    const postData : Post = {
      appUser : state.user!,
      createdAt : new Date(),
      likesCount : 0,
      commentCount : 0,
      fileUrls : selectedFiles!.map(selected => selected.uri),
      caption : values.caption,
      taggedPeople : values.taggedPeople,
      postId : '',
      postType : (selectedFiles as Array<MediaLibrary.Asset>)[0].mediaType === MediaLibrary.MediaType.photo ? 'post' : 'reels'
    }

    // TO DO : LOADING INDICATOR
    createPost(postData).then( post => {
      // TO DO : CLOSE LOADING INDICATOR
      navigation.navigate('main');
    })
    helpers.setSubmitting(false);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={uploadPost}
    >
      {( {values,touched,errors,handleSubmit,handleChange} ) => {
        handleSubmitRef.current = handleSubmit
        return(
          <View style={globalStyles.darkContainer}>
            {(touched.caption && errors.caption) && 
            <View style={styles.formRow}>
              <Icon name='exclamationcircleo' style={styles.errorLabel}/>
              <Text style={styles.errorLabel}>{errors.caption}</Text>
            </View>
            }
            <View style={styles.formRow}>
              <Image source={{uri : uri}} style={styles.imageThumbnail}/>
              <TextInput
                multiline={true}
                onChangeText={handleChange('caption')}
                value={values.caption}
                placeholder="write a caption..." 
                placeholderTextColor={'grey'} 
                style={[globalStyles.whiteText,{flex:1,padding:10}]}/>
            </View>
            <TouchableHighlight style={styles.formRow} onPress={()=>console.log("Tag people")}>
              <Text style={globalStyles.whiteText} >Tag people</Text>
              {/* TO DO : Tag Feature */}
            </TouchableHighlight>
            <TouchableHighlight style={styles.formRow} onPress={()=>console.log("Add Location")}>
              <Text style={globalStyles.whiteText} >Add location</Text>
              {/* TO DO : LOCATION SUGGESTION */}
            </TouchableHighlight>
            <TouchableHighlight style={styles.formRow} onPress={()=>console.log("Add MUSIC")}>
              <Text style={globalStyles.whiteText} >Add music</Text>
              {/* TO DO : MUSIC SUGGESTION */}
            </TouchableHighlight>
            
            <TouchableHighlight style={styles.formRow}>
              <Text style={globalStyles.whiteText} >Also post to</Text>
            </TouchableHighlight>
            <View style={styles.formRow}>
              <Text style={[globalStyles.whiteText]}>Facebook</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=> setfaceBookPost(!faceBookPost)}
                value={faceBookPost}
              />
            </View>
            <View style={styles.formRow}>
              <Text style={globalStyles.whiteText}>Twitter</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=> settwitterPost(!twitterPost)}
                value={twitterPost}
              />
            </View>
            <View style={styles.formRow}>
              <Text style={globalStyles.whiteText}>Tumblr</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=> settumblrPost(!tumblrPost)}
                value={tumblrPost}
              />
            </View>
            <View style={styles.formRow}>
              <Text style={globalStyles.whiteText}>Advanced settings</Text>
              <Icon name='right' style={globalStyles.whiteText}/>
            </View>
              
          </View>
        )
      }}
    </Formik>
  )
} 

export default AddNewPostDetailsScreen

const styles = StyleSheet.create({
  formRow : {
    flexDirection:'row',
    flexWrap:'wrap',
    paddingHorizontal:15,
    paddingVertical:5,
    justifyContent:'space-between'
  },
  imageThumbnail : {
    width:100,
    height:100,
    resizeMode:'contain'
  },
  errorLabel : {
    color : 'red',
    fontSize : 10,
    margin : 10
  }

})