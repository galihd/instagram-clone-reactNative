import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Posts } from '../../dummieData/Data'
import { PostType, User } from '../../types/modeltypes'
import { useNavigation } from '@react-navigation/native'
import { homeStackParamList } from '../../types/navtypes'
import { StackNavigationProp } from '@react-navigation/stack'
import IconButton from '../IconButton'
 

const Post = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
        {
            Posts.map((post,index)=>
                <View key={index}>
                    <PostHeader user={post.user}/>
                    <PostDetails details={post}/>
                </View>
            )
        }
    </ScrollView>
  )
}

const PostHeader : React.FC<{ user : User}> = ({user}) => {
    return(
        <View style={styles.headerContainer}>
            <TouchableOpacity style={{flexDirection : 'row', alignItems:'center'}}>
                <Image source={{uri : user.image}} style={styles.headerImg}/>
                <Text style={{color : 'white', marginLeft:6}}>{user.username}</Text>
            </TouchableOpacity>
            <IconButton iconName='dots-vertical' btnSize='small'/>
        </View>
    )
}


const PostDetails : React.FC<{details : PostType}> = ({details}) =>{
    const [liked, setliked] = useState<boolean>(false);
    const navigation = useNavigation<StackNavigationProp<homeStackParamList,"home">>();
     
    return(
        <View>
            <Image style={styles.postImg} source={{uri : details.image}}/>
            
            <View style={{...styles.headerContainer,paddingTop:10,paddingBottom : 5,borderTopWidth:0}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Icon name='heart' style={styles.footerIcon}/>
                    <Icon name='comment' style={styles.footerIcon}/>
                    <Icon name='paper-plane' style={styles.footerIcon}/>
                </View>
                <Icon name='bookmark' style={styles.footerIcon}/>
            </View>

            <View style={{paddingHorizontal:15}}>
                <Text style={{...styles.footerText,fontWeight:'600'}}>{details.likes} likes</Text>
                <Text style={styles.footerText}>
                    <Text style={{fontWeight:'600'}}>{details.user.username}</Text>
                    {` ${details.caption}`}
                </Text>
                {
                    details.comments.length > 1 ? 
                    <Text style={{...styles.footerText,color:'grey'}} onPress={()=> navigation.navigate('comments',{post : details})}>{`view all ${details.comments.length} comments`}</Text> :
                    details.comments.length == 1 &&
                    <Text style={{...styles.footerText,color:'grey'}} onPress={()=> navigation.navigate('comments',{post : details})}>{`view ${details.comments.length} comment`}</Text>
                }
            </View>
        </View>
    )

}


const styles = StyleSheet.create({
    headerContainer: {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        color : 'white',
        padding : 5
    },
    headerImg : {
        width : 40,
        height : 40,
        borderRadius : 50
    },
    postImg : {
        width : "100%",
        height : 450,
        resizeMode : 'cover'
    },
    footerIcon : {
        fontSize : 25,
        marginHorizontal : 6,
        color : 'white'
    },
    footerText :{
        color:'white',
        marginTop : 3
    }
})

export default Post