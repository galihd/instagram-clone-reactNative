import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Stories from '../components/Home/Stories'
import Feeds from '../components/Feeds'
import { globalStyles } from '../../AppStyle'
import { useFeedContext } from '../contexts/FeedContexts'
import { useUserContext } from '../contexts/UserContexts'
import { loadFeeds } from '../contexts/FeedContexts/FeedContextAction'

const HomeScreen = () => {
  const feedContext = useFeedContext()
  const {state} = useUserContext();

  useEffect(() => {
    feedContext.state.FeedItems.length === 0 &&
    loadFeeds([state.user?.appUserId!]).then(feedContext.dispatch)
       
  return () => {
    
  }
}, [])
  return (
    <SafeAreaView style={globalStyles.darkContainer}>
      <Stories/>
      <Feeds postsFeeds={feedContext.state.FeedItems}/>
    </SafeAreaView>
  )
}

export default HomeScreen

