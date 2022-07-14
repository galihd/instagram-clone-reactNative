import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { RouteProp, useRoute } from '@react-navigation/native'
import { homeStackParamList } from '../../types/navtypes'
import { Comment } from '../../types/modeltypes'



const CommentScreen = () => {
    const routeProps= useRoute<RouteProp<homeStackParamList,"comments">>();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [postComments, setPostComments] = useState<Array<Comment>>([])
    const {post: {
        caption,
        createdAt,
        appUser
    }} = routeProps.params
    
    useEffect(() => {
      setPostComments([])
    
      return () => {
        
      }
    }, [])
    
 return (
    <ScrollView style={{backgroundColor : 'black'}}>
      <View style={styles.commentContainer}>
            <TouchableOpacity><Image source={{uri : appUser.avatarUrl}} style={styles.commentImg}/></TouchableOpacity>
            <View>
                <TouchableOpacity>
                    <Text style={{...styles.commentText,fontWeight:'600'}}>{appUser.username}</Text>
                </TouchableOpacity>
                <Text style={{...styles.commentText,marginLeft:5}}>{` ${caption}`}</Text>
                
                <Text style={{...styles.commentGreyText,width:'100%'}}>{createdAt.toDateString()}</Text>
            </View>
      </View>
      {
        postComments.map((comment,idx)=>{
            return(
            <View style={styles.commentContainer} key={idx}>
                <Image source={{uri : comment.appUser.avatarUrl}} style={styles.commentImg}/>
                <View>
                    <Text style={styles.commentText}>
                        <Text style={{fontWeight:'600'}}>{comment.appUser.username}</Text>
                        {` ${comment.comment}`}
                    </Text>

                    <Text style={styles.commentGreyText}>
                        4h     10 likes     Reply
                    </Text>
                </View>
                <Icon name='heart' style={{marginLeft:'auto',alignSelf:'center'}} size={10} color='grey'/>

            </View>
            )
        })
      }
    </ScrollView>
  )
}


export default CommentScreen

const styles = StyleSheet.create({
    commentContainer : {
        flex : 1,
        flexDirection : 'row',
        padding : 10,
        flexWrap:'wrap'
    },
    commentImg : {
        width : 40,
        height : 40,
        borderRadius : 50,
        alignSelf : 'flex-start'
    },
    commentText :{
        color:'white',
        marginTop : 3,
        marginLeft: 10
    },
    commentGreyText:{
        color:'grey',
        marginTop : 5,
        marginLeft:5,
        fontSize: 13
    }
})