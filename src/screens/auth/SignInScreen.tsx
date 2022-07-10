import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { rootStackParamList } from '../../types/navtypes'
import { useNavigation } from '@react-navigation/native'
import {Formik, FormikHelpers} from 'formik'
import * as Yup from 'yup'
import { FormContainer, FormInput } from '../../components/Forms'
import { TouchableOpacity } from 'react-native-gesture-handler'
import firebaseAuth from 'firebase/auth';
import { auth } from '../../firebaseConfig'


interface signInInterface {
  username : string
  password : string
}

const initialValues : signInInterface = {
  username : '',
  password : ''
}

const validationSchema = Yup.object({
  username : Yup.string().strict(true).trim().required().min(5).max(40),
  password : Yup.string().min(8).required()
})

const SignInScreen = () => {
    const navigation = useNavigation<StackNavigationProp<rootStackParamList,"signIn">>();
    const signIn = (values : signInInterface,helpers : FormikHelpers<signInInterface>) => {
      console.log(values);
      
    }
  return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={signIn}
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
              <TouchableOpacity style={styles.submitButton} onPress={()=>handleSubmit()}>
                <Text style={{color : '#FFFFFF'}}>Log in</Text>
              </TouchableOpacity>
              <Text style={styles.formSmallText}>
                Forgotten your login details?
                <Text style={{...styles.formSmallText,color : '#4285F4'}}> Get help with logging in</Text>
              </Text>

              <View style={{flexDirection: 'row', alignItems: 'center',marginTop:30}}>
                <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#A09A9A'}} />
                <View>
                  <Text style={{...styles.formSmallText,width:20}}>OR</Text>
                </View>
                <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#A09A9A'}} />
              </View>

            </FormContainer>
            <View style={styles.formFooter}>
              <Text style={styles.formSmallText}>
                Don't have an account?
                <Text style={{...styles.formSmallText,color : '#4285F4'}} onPress={()=>navigation.navigate('signUp')}> Sign up.</Text>
              </Text>
            </View>
          </>
          )
          }}
      </Formik>
  )
}

export default SignInScreen

const styles = StyleSheet.create({
    formSmallText : {
      fontSize : 12,
      color : '#A09A9A',
      textAlign:'center'
    },
    submitButton : {
      borderRadius:5,
      justifyContent:'center',
      alignItems:'center',
      marginBottom: 15,
      width : '100%',
      height : 50,
      fontSize : 15,
      backgroundColor: '#4285F4'
    },
    formFooter : {
      justifyContent:'center',
      alignItems:'center',
      width:'100%',
      borderColor:'#535050',
      borderTopWidth:1,
      backgroundColor:'black',
      height:50
    }
})