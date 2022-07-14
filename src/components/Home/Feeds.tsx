import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Post, AppUser,Comment } from '../../types/modeltypes'
import { useNavigation } from '@react-navigation/native'
import { mainStackParamList } from '../../types/navtypes'
import { StackNavigationProp } from '@react-navigation/stack'
import IconButton from '../IconButton'
import { useUserContext } from '../../contexts/UserContexts'
import { findAllPostByUserGroup } from '../../FireBase/fireStoreFunctions/postsRepo'
import { downloadImage, downloadImages } from '../../FireBase/fireStorage'
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view'

const {width,height} = Dimensions.get('window');
const Feeds = () => {
    const [feedItems, setfeedItems] = useState<Array<Post>>([]);
    const {state} = useUserContext();

    useEffect(() => {
        feedItems.length === 0 &&
        findAllPostByUserGroup([state.user?.appUserId!]).then(posts => setfeedItems(posts))
           
      return () => {
        
      }
    }, [])
    
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
        {
            feedItems.map((post,index)=>
                <View key={index}>
                    <PostHeader userData={post.appUser}/>
                    <PostDetails postData={post}/>
                </View>
            )
        }
    </ScrollView>
  )
}

const PostHeader : React.FC<{ userData : AppUser}> = ({userData : {avatarUrl,username}}) => {
    return(
        <View style={styles.headerContainer}>
            <TouchableOpacity style={{flexDirection : 'row', alignItems:'center'}}>
                <Image source={{uri : avatarUrl}} style={styles.headerImg}/>
                <Text style={{color : 'white', marginLeft:6}}>{username}</Text>
            </TouchableOpacity>
            <IconButton iconName='dots-vertical' btnSize='small'/>
        </View>
    )
}

const PostImage : React.FC<{postData : Post,setPagerIndexState : React.Dispatch<SetStateAction<number>>}> = ({postData : {
    fileUrls,
    taggedPeople,
    },
    setPagerIndexState
}) => {
    
    if(fileUrls.length === 1)
        return (
        <TouchableHighlight>
            <Image style={styles.postImg} source={{uri : fileUrls[0]}}/>
        </TouchableHighlight>
        )
    useEffect(() => {
      
    
      return () => {
        
      }
    }, [])
    
    return (
        <>
        <PagerView 
            style={{width:'100%',height:450}} 
            showPageIndicator={true} 
            onPageSelected={(selectedEvent : PagerViewOnPageSelectedEvent) => {
                setPagerIndexState(selectedEvent.nativeEvent.position)
            }}>
            {
                fileUrls.map((fileUrl,index) => 
                    <View key={index} collapsable={false}>
                        <TouchableHighlight>
                            <Image style={styles.postImg} source={{uri : fileUrl}}/>
                        </TouchableHighlight>
                    </View>
                    )
            }
        </PagerView>
        </>

    )
    
}

const PostPagerIndicator : React.FC<{
    pageCount : number
    activePage : number
}> = ({pageCount,activePage}) => {
    
    return(
        <View style={{
            position:'absolute',
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            marginLeft: pageCount < 5 ? width/2-(pageCount*10) : width/2-(5*10),
            padding:10,
            backgroundColor:'transparent',}}>
            {
            [...Array(pageCount)].map(
                (item,index) => 
                <View
                    key={index}
                    style={{
                        height:8,
                        width:8,
                        borderRadius:50,
                        marginHorizontal:2,
                        backgroundColor : (activePage === (index)) ? 'white' : 'grey'
                        }}>
                </View>)
            }
        </View>
    )
}

const PostDetails : React.FC<{postData : Post}> = (
    {postData }) =>{
    const [liked, setliked] = useState<boolean>(false);
    const [pagerIndexState, setPagerIndexState] = useState<number>(0);
    const navigation = useNavigation<StackNavigationProp<mainStackParamList,"home">>();
    

    return(
        <View>
            <PostImage postData={postData} setPagerIndexState={setPagerIndexState}/>
            
            <View style={styles.headerContainer}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Icon name='heart' style={styles.footerIcon}/>
                    <Icon name='comment' style={styles.footerIcon}/>
                    <Icon name='paper-plane' style={styles.footerIcon}/>
                </View>
                {
                    postData.fileUrls.length > 1 && 
                        <PostPagerIndicator 
                            pageCount={postData.fileUrls.length} 
                            activePage={pagerIndexState}/>
                }
                <Icon name='bookmark' style={styles.footerIcon}/>
            </View>

            <View style={{paddingHorizontal:15}}>
                <Text style={[styles.footerText,styles.boldText]}>{postData.likesCount} likes</Text>
                <Text style={styles.footerText}>
                    <Text style={styles.boldText}>{postData.appUser.username}</Text>
                    {` ${postData.caption}`}
                </Text>
                {
                    postData.commentCount > 1 ? 
                    <Text style={{...styles.footerText,color:'grey'}} onPress={()=> navigation.navigate('comments',{post : postData})}>{`view all ${postData.commentCount} comments`}</Text> :
                    postData.commentCount == 1 &&
                    <Text style={{...styles.footerText,color:'grey'}} onPress={()=> navigation.navigate('comments',{post : postData})}>{`view ${postData.commentCount} comment`}</Text>
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
        padding : 10
    },
    headerImg : {
        width : 35,
        height : 35,
        borderRadius : 50
    },
    postImg : {
        width : "100%",
        height : "100%",
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
    },
    boldText : {
        fontWeight: '600'
    }
})

export default Feeds