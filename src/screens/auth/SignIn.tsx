import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { authStackParamList } from '../../types/navtypes'
import { useNavigation } from '@react-navigation/native'


const SignIn = () => {
    const navigation = useNavigation<StackNavigationProp<authStackParamList,"SignIn">>();
  return (
    <View style={styles.authContainer}>
      <Button title='Sign In' />
      <Button title='Register' onPress={()=> navigation.navigate('Register')}/>
    </View>
  )
}

export default SignIn

const styles = StyleSheet.create({
    authContainer : {
        flex : 1,
        backgroundColor : 'grey',
        alignItems : 'center',
        justifyContent : 'center'

    },
    authButton : {
      
    }
})