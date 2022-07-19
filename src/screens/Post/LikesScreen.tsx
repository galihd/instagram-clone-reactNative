import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Like } from '../../types/modeltypes'
import { RouteProp, useRoute } from '@react-navigation/native'
import { mainStackParamList } from '../../types/navtypes'
import { findAllPostLikeByPostId } from '../../FireBase/fireStoreFunctions/postsRepo'
import { formStyle, globalStyles } from '../../../AppStyle'
import { useFeedContext } from '../../contexts/FeedContexts'
import { updateFeeds } from '../../contexts/FeedContexts/FeedContextAction'


const LikesScreen = () => {
  const [postLikes, setPostLikes] = useState<Array<Like>>([])
  const routeProp = useRoute<RouteProp<mainStackParamList,"likes">>().params;
  const {state,dispatch} = useFeedContext()
  useEffect(() => {
    findAllPostLikeByPostId(routeProp.post.postId).then(likes => {
      dispatch(updateFeeds({...routeProp.post,likesCount : likes.length}))
      setPostLikes(likes)
    })
  
    return () => {
      
    }
  }, [])
  
  return (
    <ScrollView style={globalStyles.darkContainer}>
      {
        postLikes.map((like) => 
          <View key={like.likeId} style={[globalStyles.flexRowSpaceAround,{padding:10}]}>
            <Image source={{uri : like.appUser.avatarUrl}} style={styles.likeImg}/>
            <View style={{flex : 1,paddingHorizontal:10}}>
              <Text style={globalStyles.whiteText}>{like.appUser.username}</Text>
              <Text style={globalStyles.lightGreyText}>{like.appUser.username}</Text>
            </View>
            {/* TO DO : FOLLOW CHECK */}
            <TouchableOpacity 
              style={{height:40,paddingHorizontal:20,backgroundColor:'#4285F4',alignItems:'center',justifyContent:'center',borderRadius:8}}>
              <Text style={globalStyles.whiteText}>Follow</Text>
            </TouchableOpacity>
          </View>
        )
      }
    </ScrollView>
  )
}

export default LikesScreen

const styles = StyleSheet.create({
  likeImg : {
    width : 50,
    height : 50,
    borderRadius : 50,
    alignSelf : 'flex-start'
  }
})