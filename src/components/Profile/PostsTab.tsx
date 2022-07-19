import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React from 'react'
import { Post } from '../../types/modeltypes'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { globalStyles, gridStyle } from '../../../AppStyle'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { mainStackParamList } from '../../types/navtypes'

const {width,height} = Dimensions.get('window')

const PostsTab : React.FC<{userPosts : Post[]}> = ({userPosts}) => {
  const navigation = useNavigation<StackNavigationProp<mainStackParamList,"profile">>()

  return (
    <ScrollView style={globalStyles.darkContainer} contentContainerStyle={gridStyle.gridContentContainer}>
       {userPosts.map((post,idx) => 
            <TouchableHighlight key={idx} onPress={()=> navigation.navigate('ProfilePost',{posts : userPosts})}>
            {
                <Image source={{uri : post.fileUrls[0]}} style={gridStyle.standardGridImage}/> 
                // <View>
                // <Image source={{uri : post.fileUrls[0]}} style={styles.GridImage}/> 
                //     <Icon name='play-outline' style={styles.GridVideoBadge}/>
                // </View>
            }
            </TouchableHighlight>
        )}
    </ScrollView>
  )
}

export default PostsTab

const styles = StyleSheet.create({
  
})