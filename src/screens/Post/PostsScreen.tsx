import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { mainStackParamList } from '../../types/navtypes'
import Feeds from '../../components/Feeds'
import { globalStyles } from '../../../AppStyle'

const PostsScreen = () => {
    const {posts} = useRoute<RouteProp<mainStackParamList,"ProfilePost">>().params
  return (
    <SafeAreaView style={globalStyles.darkContainer}>
      <Feeds postsFeeds={posts}/>
    </SafeAreaView>
  )
}

export default PostsScreen

const styles = StyleSheet.create({})