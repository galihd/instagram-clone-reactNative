import { Image, StyleSheet, Switch, Text, TextInput, TouchableHighlight, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { RouteProp, useRoute } from '@react-navigation/native'
import { createPostStackParamList } from '../../types/navtypes'
import * as MediaLibrary from 'expo-media-library'
import {Formik} from 'formik'
import * as Yup from 'yup'


const initialValues  = {
  image : '',
  caption : '',
  postDate : '',
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
  const routeProp = useRoute<RouteProp<createPostStackParamList,"postDetails">>();
  const {selectedFiles} = routeProp.params
  const {uri,...rest} =  (selectedFiles as Array<MediaLibrary.Asset>)[0]; 

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values,formikHelpers)=>{
        (selectedFiles as MediaLibrary.Asset[])
          .map((file,idx) => console.log("selected files -",`${idx} - ${file.filename}`))
        console.log("caption",values.caption);
        formikHelpers.setSubmitting(false);
      }}
    >
      {( {values,touched,errors,handleSubmit,handleChange} ) => {
        handleSubmitRef.current = handleSubmit
        return(
          <View style={styles.formContainer}>
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
                style={{...styles.formText,flex:1}}/>
            </View>
            <TouchableHighlight style={styles.formRow} onPress={()=>console.log("Tag people")}>
              <Text style={styles.formText} >Tag people</Text>
              {/* TO DO : Tag Feature */}
            </TouchableHighlight>
            <TouchableHighlight style={styles.formRow} onPress={()=>console.log("Add Location")}>
              <Text style={styles.formText} >Add location</Text>
              {/* TO DO : LOCATION SUGGESTION */}
            </TouchableHighlight>
            <TouchableHighlight style={styles.formRow} onPress={()=>console.log("Add MUSIC")}>
              <Text style={styles.formText} >Add music</Text>
              {/* TO DO : MUSIC SUGGESTION */}
            </TouchableHighlight>
            
            <TouchableHighlight style={styles.formRow}>
              <Text style={styles.formText} >Also post to</Text>
            </TouchableHighlight>
            <View style={styles.formRow}>
              <Text style={styles.formText}>Facebook</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=> setfaceBookPost(!faceBookPost)}
                value={faceBookPost}
              />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formText}>Twitter</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=> settwitterPost(!twitterPost)}
                value={twitterPost}
              />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formText}>Tumblr</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=> settumblrPost(!tumblrPost)}
                value={tumblrPost}
              />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formText}>Advanced settings</Text>
              <Icon name='right' style={styles.formText}/>
            </View>
              
          </View>
        )
      }}
    </Formik>
  )
} 

export default AddNewPostDetailsScreen

const styles = StyleSheet.create({
  formContainer : {
    height:'100%',
    backgroundColor:'black'
  },
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
  formText : {
    color : 'white',
    fontSize : 15,
    padding : 10
  },
  errorLabel : {
    color : 'red',
    fontSize : 10,
    margin : 10
  }

})