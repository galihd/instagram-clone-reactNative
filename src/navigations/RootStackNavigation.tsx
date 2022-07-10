import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { rootStackParamList } from '../types/navtypes'
import MainNavigation from './MainNavigation'
import SignInScreen from '../screens/auth/SignInScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import LoadingScreen from '../screens/LoadingScreen'

const RootStackNavigation = () => {
    const rootStack = createStackNavigator<rootStackParamList>();

    
  return (
    <NavigationContainer>
      <StatusBar
            animated={true}
            backgroundColor="black"
            hidden={false} 
      />
      <rootStack.Navigator initialRouteName='loading'>
        <rootStack.Screen name='loading' component={LoadingScreen} options={{headerShown:false}}/>
        <rootStack.Screen name='signIn' component={SignInScreen} options={{headerShown:false}}/>
        <rootStack.Screen name='signUp' component={RegisterScreen} options={{headerShown:false}}/>
        <rootStack.Screen name='main' component={MainNavigation} options={{headerShown:false}}/>
      </rootStack.Navigator>
    </NavigationContainer>
  )
}

export default RootStackNavigation

const styles = StyleSheet.create({})