import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { homeStackParamList } from '../types/navtypes'

type props = RouteProp<homeStackParamList,"Profile">;
const ProfileScreen: React.FC<props> = () => {
  const navigation = useNavigation<StackNavigationProp<homeStackParamList,"Profile">>()
  const routeProps = useRoute<RouteProp<homeStackParamList,"Profile">>()
  
  
  
  return (
    <View>
      <Text>ProfileScreen</Text>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})