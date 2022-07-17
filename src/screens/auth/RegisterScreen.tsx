import { Text, TouchableOpacity, View } from 'react-native'
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
import { auth } from '../../FireBase/firebaseConfig'
import { usersRepo } from '../../FireBase/fireStoreFunctions'
import { formStyle, globalStyles } from '../../../AppStyle'

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
  const {dispatch} = useUserContext();

  
  const register = (values : signUpInteface,helpers : FormikHelpers<signUpInteface>) => {
    createUserWithEmailAndPassword(auth,values.email,values.password)
    .then(async (result) => { 
      const createdUser = await usersRepo.createNewUser(result.user.email!);
      dispatch(signUp(createdUser));
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
              onChangeHandle={handleChange('email')}
              placeholderText='Email'
            />
            <FormInput 
              value={values.password}
              onChangeHandle={handleChange('password')}
              placeholderText='Password'
              isPassword={true}
            />
            <TouchableOpacity style={formStyle.formsubmitButton} onPress={()=>handleSubmit()}>
                <Text style={{color : '#FFFFFF'}}>Sign up</Text>
            </TouchableOpacity>
          </FormContainer>

          <View style={formStyle.darkFormFooter}>
            <Text style={globalStyles.lightGreyTextsm}>
              Already have an account?
              <Text style={globalStyles.linkTextsm} onPress={()=>navigation.navigate('signIn')}> Sign in.</Text>
            </Text>
          </View>
        </>
      )}
    </Formik>
  )
}

export default RegisterScreen