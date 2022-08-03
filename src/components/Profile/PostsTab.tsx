import {FlatList, TouchableHighlight} from 'react-native'
import React from 'react'
import { Post } from '../../types/modeltypes'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { globalStyles, gridStyle } from '../../../AppStyle'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { mainStackParamList } from '../../types/navtypes'
import CachedImage from '../CachedImage'
import { Video } from 'expo-av'

const PostsTab : React.FC<{userPosts : Post[]}> = ({userPosts}) => {
  const navigation = useNavigation<StackNavigationProp<mainStackParamList,"profile">>()

  return (
    <FlatList 
      style={globalStyles.darkContainer} 
      numColumns={3}
      data={userPosts}
      keyExtractor={item => item.postId}
      renderItem={
        ({item})=>
          <TouchableHighlight onPress={()=> navigation.navigate('ProfilePost',{posts : userPosts})}>
            {
                item.postType==='post' ?
                <CachedImage downloadUrl={item.fileUrls[0]} styles={gridStyle.standardGridImage}/> 
                :
                <>
                  <Video source={{uri : item.fileUrls[0]}} style={gridStyle.standardGridImage}/>
                  <Icon name='play-outline' style={gridStyle.GridVideoBadge}/>
                </>

            }
          </TouchableHighlight>
      }
    />
  )
}

export default PostsTab