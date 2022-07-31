import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Stories from '../components/Home/Stories'
import Feeds from '../components/Feeds'
import { globalStyles } from '../../AppStyle'
import { useFeedContext } from '../contexts/FeedContexts'
import { useUserContext } from '../contexts/UserContexts'
import { loadFeeds } from '../contexts/FeedContexts/FeedContextAction'
import { RouteProp } from '@react-navigation/native'
import { mainStackParamList } from '../types/navtypes'

const HomeScreen : React.FC<{
  route : RouteProp<mainStackParamList,"home">
}> = ({route}) => {
  const feedContext = useFeedContext()
  const {state} = useUserContext();

  useEffect(() => {
      loadFeeds([...state.relation.following.map(following => following.toUserId),state.user?.appUserId!]).then(feedContext.dispatch)

  }, [state.relation.following])
  return (
    <SafeAreaView style={globalStyles.darkContainer}>
      <Stories/>
      {
        route.params.isPosting &&
          <View>
            <Text style={globalStyles.whiteText}>Finishing up your post...</Text>
          </View>
      }

      <Feeds postsFeeds={feedContext.state.FeedItems}/>
    </SafeAreaView>
  )
}

export default HomeScreen

