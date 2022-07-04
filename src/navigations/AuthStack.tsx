import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { authStackParamList } from '../types/navtypes'
import SignIn from '../screens/auth/SignIn'
import Register from '../screens/auth/Register'

const AuthStack = () => {
    const authStack = createStackNavigator<authStackParamList>();
  return (
    <authStack.Navigator>
        <authStack.Screen name='SignIn' component={SignIn}/>
        <authStack.Screen name='Register' component={Register}/>
    </authStack.Navigator>
  )
}

export default AuthStack

const styles = StyleSheet.create({})