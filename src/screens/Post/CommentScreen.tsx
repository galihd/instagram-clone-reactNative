import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { ScrollView, TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { RouteProp, useRoute } from '@react-navigation/native'
import { mainStackParamList } from '../../types/navtypes'
import { Comment, Post } from '../../types/modeltypes'
import { globalStyles, gridStyle } from '../../../AppStyle'
import { useUserContext } from '../../contexts/UserContexts'
import { Formik, FormikHelpers } from 'formik'
import * as yup from 'yup';
import { createComment, findAllCommentsByPostId } from '../../FireBase/fireStoreFunctions/postsRepo'
import { useFeedContext } from '../../contexts/FeedContexts'
import { updateFeeds } from '../../contexts/FeedContexts/FeedContextAction'


const validationSchema = yup.object({
    comment : yup.string().required().max(300)
})

const CommentScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [postComments, setPostComments] = useState<Array<Comment>>([])
    const feedContext = useFeedContext();
    const {state} = useUserContext();
    const routeProps= useRoute<RouteProp<mainStackParamList,"comments">>();
    const {post: {
        postId,
        caption,
        createdAt,
        appUser
    }} = routeProps.params
    
    const getPostComments = ()=>{
        findAllCommentsByPostId(postId)
        .then(comments =>  {
            setPostComments(comments);
            const updatedPost : Post = {...routeProps.params.post,commentCount : comments.length}
            feedContext.dispatch(updateFeeds(updatedPost))
        })
    }

    const likeComment = () => {

    }

    const createPostComment = (values : {comment : string},helpers : FormikHelpers<{comment : string}>) => {
        createComment({
            commentId : '',
            postId : postId,
            comment : values.comment,
            appUser : state.user!,
            createdAt : new Date(),
            targetType : 'post',
            likesCount : 0,
            replyCount : 0
        }).then(() => {
            getPostComments()
            helpers.setSubmitting(false);
        })
    }
    
    useEffect(() => {
      if(postComments.length === 0){
        getPostComments()
      }

    }, [])
    
 return (
    <>
    <ScrollView style={[globalStyles.darkContainer,{padding : 10}]}>
      <View style={gridStyle.gridContentContainer}>
            <TouchableOpacity>
                <Image source={{uri : appUser.avatarUrl}} style={styles.commentImg}/>
            </TouchableOpacity>
            <View style={{flex:1,paddingLeft:10}}>
                <TouchableOpacity>
                    <Text style={[globalStyles.whiteText,globalStyles.boldText,{marginTop:3}]}>
                        {appUser.username}
                    </Text>
                </TouchableOpacity>
                <Text style={[globalStyles.whiteText,{marginTop:3}]}>
                    {`${caption}`}
                </Text>
                {/* TO DO : DATE */}
                <Text style={[globalStyles.lightGreyTextsm,{width:'100%'},{marginTop:3}]}>
                    {createdAt.toLocaleString()}
                </Text>
            </View>
      </View>
      {
        postComments.map((comment,idx)=>{
            return(
            <View style={[globalStyles.flexRowSpaceAround,{paddingVertical: 10}]} key={idx}>
                <Image source={{uri : comment.appUser.avatarUrl}} style={styles.commentImg}/>
                <View style={{paddingHorizontal : 10}}>
                    <Text style={globalStyles.whiteText}>
                        <Text style={globalStyles.boldText}>{comment.appUser.username}</Text>
                        {` ${comment.comment}`}
                    </Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={[globalStyles.lightGreyTextsm,{marginRight:20}]}>
                            4h
                        </Text>
                        {
                            comment.likesCount > 0 && 
                            <Text style={[globalStyles.lightGreyTextsm,{marginRight:20}]}>
                            {`${comment.likesCount} likes `}
                        </Text>
                        }
                        <Text style={[globalStyles.lightGreyTextsm,{marginRight:20}]}>
                            Reply
                        </Text>
                        <Text style={[globalStyles.lightGreyTextsm,{marginRight:20}]}>
                            Send
                        </Text>
                    </View>
                </View>
                <Icon name='heart' style={{marginLeft:'auto',alignSelf:'center'}} size={10} color='grey'/>
            </View>
            )
        })
      }
    </ScrollView>
    <Formik
        initialValues={{comment : ''}}
        onSubmit={createPostComment}
        validationSchema={validationSchema}
    >
        { ({handleChange,handleSubmit}) => {
            return (
            <View style={[globalStyles.darkContainer,{flex:0,flexDirection:'row',paddingHorizontal:10,alignItems:'center'}]}>
                <Image source={{uri: `data:image/png;base64,${state.user?.avatarUrl}`}}  style={styles.commentImg}/>
                <TextInput 
                    placeholder='Add a comment...' 
                    placeholderTextColor={'#A09A9A'} 
                    style={[globalStyles.whiteTextSm,{paddingHorizontal:5,height:'100%',flex:1}]}
                    onChangeText={handleChange('comment')}
                    />
                <Text style={[globalStyles.boldText,{color:'#4285F4'}]} onPress={()=>handleSubmit()}>Send</Text>
            </View>
            )
        }}
        
    </Formik>
    </>
  )
}


export default CommentScreen

const styles = StyleSheet.create({
    commentImg : {
        width : 40,
        height : 40,
        borderRadius : 50,
        alignSelf : 'flex-start'
    }
})