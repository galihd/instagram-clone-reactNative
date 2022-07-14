import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../components/Home/Header'
import Stories from '../components/Home/Stories'
import Feeds from '../components/Home/Feeds'

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header/>
      <Stories/>
      <Feeds/>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'black',
        margin:0,
    }
})