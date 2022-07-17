import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { rootStackParamList } from '../../types/navtypes'
import { StackActions, useNavigation } from '@react-navigation/native'
import {Formik, FormikHelpers} from 'formik'
import * as Yup from 'yup'
import { FormContainer, FormInput } from '../../components/Forms'
import { TouchableOpacity } from 'react-native-gesture-handler'
import {signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../../FireBase/firebaseConfig'
import { useUserContext } from '../../contexts/UserContexts'
import { signIn } from '../../contexts/UserContexts/UserContextAction'
import { usersRepo } from '../../FireBase/fireStoreFunctions'
import { downloadImage, downloadImageAsBase64 } from '../../FireBase/fireStorage'
import { formStyle, globalStyles } from '../../../AppStyle'


interface signInInterface {
  username : string
  password : string
}

const initialValues : signInInterface = {
  username : '',
  password : ''
}

const validationSchema = Yup.object({
  username : Yup.string().strict(true).trim().required().min(5),
  password : Yup.string().min(8).required()
})

const SignInScreen = () => {
    const {state,dispatch} = useUserContext();
    const navigation = useNavigation<StackNavigationProp<rootStackParamList,"signIn">>();


    const logIn = (values : signInInterface,helpers : FormikHelpers<signInInterface>) => {
      signInWithEmailAndPassword(auth,values.username,values.password)
      .then(async response => {
        const signedUser = await usersRepo.findAppUserByEmail(response.user.email!);
        const userAvatar = await downloadImageAsBase64(signedUser.avatarUrl!);
        dispatch( signIn({...signedUser,avatarUrl : userAvatar}) );
      })
      .catch(er => console.log(er))
    }
    useEffect(() => {
      if(state.isAuthenticated)navigation.dispatch(StackActions.replace('main'))
    }, [state.isAuthenticated])
    

  return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={logIn}
      >
          {( {values,handleChange,handleSubmit} )=>{
          return(
          <>
            <FormContainer>
              <FormInput 
                placeholderText='Phone number,email address or username'
                onChangeHandle={handleChange('username')}
                value={values.username}
              />
              <FormInput 
                isPassword={true}
                placeholderText='Password'
                onChangeHandle={handleChange('password')}
                value={values.password}
              />
              <TouchableOpacity style={formStyle.formsubmitButton} onPress={()=>handleSubmit()}>
                <Text style={{color : '#FFFFFF'}}>Log in</Text>
              </TouchableOpacity>
              <Text style={[globalStyles.lightGreyTextsm,{textAlign:'center'}]}>
                Forgotten your login details?
                <Text style={globalStyles.linkTextsm}> Get help with logging in</Text>
              </Text>

              <View style={{flexDirection: 'row', alignItems: 'center',marginTop:30}}>
                <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#A09A9A'}} />
                <View>
                  <Text style={globalStyles.lightGreyTextlg}>OR</Text>
                </View>
                <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#A09A9A'}} />
              </View>

            </FormContainer>
            <View style={formStyle.darkFormFooter}>
              <Text style={globalStyles.lightGreyTextsm}>
                Don't have an account?
                <Text style={globalStyles.linkTextsm} onPress={()=>navigation.navigate('signUp')}> Sign up.</Text>
              </Text>
            </View>
          </>
          )
          }}
      </Formik>
  )
}

export default SignInScreen