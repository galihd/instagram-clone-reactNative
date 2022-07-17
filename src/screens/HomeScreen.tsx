import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Stories from '../components/Home/Stories'
import Feeds from '../components/Home/Feeds'
import { globalStyles } from '../../AppStyle'

const HomeScreen = () => {
  return (
    <SafeAreaView style={globalStyles.darkContainer}>
      <Stories/>
      <Feeds/>
    </SafeAreaView>
  )
}

export default HomeScreen

