import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Stories from '../components/Home/Stories'
import Feeds from '../components/Feeds'
import { globalStyles } from '../../AppStyle'
import { useFeedContext } from '../contexts/FeedContexts'
import { useUserContext } from '../contexts/UserContexts'
import { loadFeeds } from '../contexts/FeedContexts/FeedContextAction'
import { RouteProp } from '@react-navigation/native'
import { mainStackParamList } from '../types/navtypes'
import CachedImage from '../components/CachedImage'

const HomeScreen : React.FC<{
  route : RouteProp<mainStackParamList,"home">
}> = ({route}) => {
  const feedContext = useFeedContext()
  const userContext = useUserContext();

  useEffect(() => {
      loadFeeds([...userContext.state.relation.following.map(following => following.toUserId),userContext.state.user?.appUserId!])
      .then(feedContext.dispatch)

  }, [userContext.state.relation.following])
  return (
    <SafeAreaView style={globalStyles.darkContainer}>
      <Stories/>
      {
        route.params.postingFile &&
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Image source={{uri:route.params.postingFile}} style={{width:50,height:50,resizeMode:'contain',marginEnd:10}}/>
            <Text style={globalStyles.whiteText}>Finishing up...</Text>
          </View>
      }
      <Feeds postsFeeds={feedContext.state.FeedItems}/>
    </SafeAreaView>
  )
}

export default HomeScreen

