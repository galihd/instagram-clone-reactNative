import { Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { globalStyles } from '../../../AppStyle'
import { useUserContext } from '../../contexts/UserContexts'
import { Formik, FormikHelpers } from 'formik'
import { FormInput } from '../../components/Forms'
import {AppUser} from '../../types/modeltypes'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { mainStackParamList } from '../../types/navtypes'
import IconButton from '../../components/IconButton'
import BottomDrawer from '../../components/BottomDrawer'
import * as MediaLibrary from 'expo-media-library'
import { GallerySelector } from '../../components/Post'
import { CameraCapturedPicture } from 'expo-camera'
import { updateUser } from '../../contexts/UserContexts/UserContextAction'




const EditProfileScreen = () => {

    const [drawerOpen, setdrawerOpen] = useState(false);
    const {state,dispatch} = useUserContext();

    const initialValues : AppUser = {...state.user!}
    const navigation = useNavigation<StackNavigationProp<mainStackParamList,"ProfileEdit">>();
    const {newAvatar} = useRoute<RouteProp<mainStackParamList,"ProfileEdit">>().params;
    const submitRef =  useRef<(e?: React.FormEvent<HTMLFormElement> | undefined) => void>();

    const submitProfileEdit = async (values : AppUser,helpers : FormikHelpers<AppUser>) => {
        // LOADING
        if(newAvatar){
            await updateUser({...values,
                avatarUrl : newAvatar.uri},true)
            .then(dispatch)
        }else{
            await updateUser(values).then(dispatch)
        }
        // HIDE LOADING
    }

    useEffect(() => {
      navigation.setOptions({
        headerRight : ()=><IconButton iconName='check' btnSize={'large'} pressFunction={submitRef.current}/>
      })
    }, [])
    
    const openGallery = async () => {
        const mediaLibraryPermissions = await MediaLibrary.requestPermissionsAsync();
        if(mediaLibraryPermissions.granted){
            navigation.navigate('ProfileGallery')
        }
    }
    
  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={globalStyles.darkContainer}
    >
    <Formik
        initialValues={initialValues}
        onSubmit={submitProfileEdit}
    >
        { ({values,errors,handleChange,handleSubmit}) => {
            submitRef.current = handleSubmit
            return(
                <TouchableWithoutFeedback 
                    onPress={()=>{
                        Keyboard.dismiss(); 
                        setdrawerOpen(false)
                    }}>
                    <View>
                        <View style={{padding:15,alignItems:'center',alignSelf:'center'}}>
                            <Image 
                                source={{uri : newAvatar? newAvatar.uri :  `data:image/png;base64,${state.user?.avatarUrl}`}} 
                                style={styles.avatarImage}/>
                            <Text 
                                style={globalStyles.linkText}
                                onPress={()=> setdrawerOpen(true)}>
                                Change profile photo
                            </Text>
                        </View>
                        <View style={styles.formRow}>
                            <Text style={[globalStyles.lightGreyTextsm,{paddingHorizontal : 5}]}>Name</Text>
                            <FormInput placeholderText='' variant='profile' onChangeHandle={handleChange('username')} value={values.username} />
                        </View>
                        <View style={styles.formRow}>
                            <Text style={[globalStyles.lightGreyTextsm,{paddingHorizontal : 5}]}>Phone number</Text>
                            <FormInput placeholderText='' variant='profile' onChangeHandle={handleChange('phoneNumber')} value={values.phoneNumber!} />
                        </View>
                        <View style={styles.formRow}>
                            <Text style={[globalStyles.lightGreyTextsm,{paddingHorizontal : 5}]}>Bio</Text>
                            <FormInput placeholderText='' variant='profile' onChangeHandle={handleChange('bio')} value={values.bio!} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )
            } 
        }
    </Formik>
        {
            drawerOpen && 
            <BottomDrawer isOpen={drawerOpen} closeFuntion={()=>setdrawerOpen(false)} size='small'>
                <Text style={globalStyles.whiteText} onPress={openGallery}>New profile photo</Text>
                <Text style={globalStyles.whiteText}>Import from facebook</Text>
                <Text style={[globalStyles.whiteText,{color : 'red'}]}>Remove profile photo</Text>
            </BottomDrawer>
        }
    </KeyboardAvoidingView>
  )
}


const EditProfileGalleryScreen = () => {

    const [assets, setAssets] = useState<Array<MediaLibrary.Asset>>([])
    const [selectedFiles, setSelectedFiles] = useState<MediaLibrary.Asset[] | CameraCapturedPicture[]>();
    const navigation = useNavigation<StackNavigationProp<mainStackParamList,"ProfileEdit">>();
    const getMedias = async () =>{
        const pagedAssets = await MediaLibrary.getAssetsAsync({
          first : 20,
          mediaType : [MediaLibrary.MediaType.photo,MediaLibrary.MediaType.video]
        })
        setAssets(pagedAssets.assets);
      }
      
    const passFileToEditPage = () => {
        if(selectedFiles){
            navigation.navigate('ProfileEdit',{newAvatar : selectedFiles[0] as MediaLibrary.Asset})
        }
    }

    useEffect(() => {
        getMedias()
    }, [])
    useEffect(()=>{
        navigation.setOptions({
            headerRight : ()=>
            <IconButton 
                iconName='check' 
                btnSize={'large'} 
                pressFunction={passFileToEditPage}
            />
            })
    },[selectedFiles])
      

  return (
    <GallerySelector
        assets={assets} 
        selectedFilesState={selectedFiles} 
        setSelectFileFunction={setSelectedFiles} 
        showUtility={false}/>
  )
}

export {EditProfileGalleryScreen,EditProfileScreen}


const styles = StyleSheet.create({
    avatarImage : {
        width : 100,
        height : 100,
        borderRadius : 50,
        marginBottom:20
    },
    formRow : {
        flexDirection:'row',
        flexWrap:'wrap',
        paddingHorizontal:15,
        paddingVertical:5,
        justifyContent:'space-between'
      }
})