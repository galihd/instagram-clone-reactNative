import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Formik, FormikHelpers } from 'formik'
import * as yup from 'yup'
import { FormContainer, FormInput } from '../../components/Forms'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { rootStackParamList } from '../../types/navtypes'
import { signUp } from '../../contexts/UserContexts/UserContextAction'
import { useUserContext } from '../../contexts/UserContexts'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import { auth } from '../../firebaseConfig'

interface signUpInteface {
  email : string
  password : string
}

const initialValues : signUpInteface = {
  email : '',
  password : ''
}

const validationSchema = yup.object({
  email : yup.string().required().email(),
  password : yup.string().required().min(8)
})

const RegisterScreen = () => {
  const navigation = useNavigation<StackNavigationProp<rootStackParamList,"signUp">>();
  const {state,dispatch} = useUserContext();

  const register = (values : signUpInteface,helpers : FormikHelpers<signUpInteface>) => {
    createUserWithEmailAndPassword(auth,values.email,values.password)
    .then((result) => { 
      // useless dispatch
      dispatch(signUp(result.user));
      
      navigation.navigate('signIn')
    })
    .catch(err => console.log(err))
  }

  return (
    <Formik 
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={register}
      >
      {( {values,errors,handleChange,handleSubmit} ) => (
        <>
          <FormContainer>
            <FormInput 
              value={values.email}
              onChangeHandle={()=>handleChange('email')}
              placeholderText='Email'
            />
            <FormInput 
              value={values.password}
              onChangeHandle={()=>handleChange('password')}
              placeholderText='Password'
              isPassword={true}
            />
            <TouchableOpacity style={styles.submitButton} onPress={()=>handleSubmit()}>
                <Text style={{color : '#FFFFFF'}}>Sign up</Text>
            </TouchableOpacity>
          </FormContainer>

          <View style={styles.formFooter}>
            <Text style={styles.formSmallText}>
              Already have an account?
              <Text style={{...styles.formSmallText,color : '#4285F4'}} onPress={()=>navigation.navigate('signIn')}> Sign in.</Text>
            </Text>
          </View>
        </>
      )}
    </Formik>
  )
}

export default RegisterScreen

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