import {FlatList, TouchableHighlight} from 'react-native'
import React from 'react'
import { Post } from '../../types/modeltypes'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { globalStyles, gridStyle } from '../../../AppStyle'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { mainStackParamList } from '../../types/navtypes'
import CachedImage from '../CachedImage'

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
                <CachedImage downloadUrl={item.fileUrls[0]} styles={gridStyle.standardGridImage}/> 
                // <View>
                // <Image source={{uri : post.fileUrls[0]}} style={styles.GridImage}/> 
                //     <Icon name='play-outline' style={styles.GridVideoBadge}/>
                // </View>
            }
          </TouchableHighlight>
      }
    />
  )
}

export default PostsTab