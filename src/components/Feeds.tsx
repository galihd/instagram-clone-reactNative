import { Dimensions, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { memo, SetStateAction, useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Post, AppUser,Comment, Like } from '../types/modeltypes'
import { useNavigation } from '@react-navigation/native'
import { mainStackParamList } from '../types/navtypes'
import { StackNavigationProp } from '@react-navigation/stack'
import IconButton from './IconButton'
import { useUserContext } from '../contexts/UserContexts'
import { createLike, deleteLike} from '../FireBase/fireStoreFunctions/postsRepo'
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view'
import { globalStyles } from '../../AppStyle'
import { useFeedContext } from '../contexts/FeedContexts'
import BottomDrawer from './BottomDrawer'
import { removePost } from '../contexts/UserContexts/UserContextAction'
import CachedImage from './CachedImage'

const {width} = Dimensions.get('window');
const Feeds :React.FC<{postsFeeds : Post[]}> = ({postsFeeds})=>{
    return (
        <FlatList 
            data={postsFeeds}
            keyExtractor = {({postId}) => postId}
            renderItem = {_RenderItem}
        />
    )
}



const _RenderItem : React.FC<{item : Post}> = ({item}) => {
    return(
        <>
            <PostHeader postData={item}/>
            <PostDetails postData={item}/>
        </>
    )
}
    


const PostHeader : React.FC<{ postData : Post}> = ({postData}) => {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const navigation = useNavigation<StackNavigationProp<mainStackParamList,"home">>();
    const userContext = useUserContext();
    const feedContext = useFeedContext();



    const deletePost = async () => {
        setDrawerOpen(false);
        // TO DO : LOADING
        await removePost(postData).then(userContext.dispatch)
        // TO DO : CLOSE LOADING

    }
    return(
        <View style={styles.headerContainer}>
            <TouchableOpacity 
                style={{flexDirection : 'row', alignItems:'center'}} 
                onPress={()=>{navigation.navigate('profile',{appUserId: postData.appUser.appUserId,fromHomeTab:false})}}>
                <Image source={{uri : postData.appUser.avatarUrl}} style={styles.headerImg}/>
                <Text style={{color : 'white', marginLeft:6}}>{postData.appUser.username}</Text>
            </TouchableOpacity>
            <IconButton iconName='dots-vertical' btnSize='small' pressFunction={()=>setDrawerOpen(true)}/>
            {
                drawerOpen && 
                <BottomDrawer 
                    isOpen={drawerOpen}
                    size = 'large' 
                    closeFuntion={()=>setDrawerOpen(false)}>
                        { postData.appUser.appUserId ===  userContext.state.user?.appUserId ?
                        <>
                            <View style={globalStyles.flexRowSpaceAround}>
                                <View style={{alignItems:'center'}}>
                                    <Icon name='share-alt' style={[styles.drawerCircleButton]}/>
                                    <Text style={globalStyles.whiteText}>Share</Text>
                                </View>
                                <View style={{alignItems:'center'}}>
                                    <Icon name='link' style={[styles.drawerCircleButton]}/>
                                    <Text style={globalStyles.whiteText}>Link</Text>
                                </View>
                            </View>
                            <View style={{height: StyleSheet.hairlineWidth, backgroundColor: '#A09A9A'}} />
                            <Text style={[globalStyles.whiteText,{paddingHorizontal:10,marginVertical:3}]}>Post to other apps...</Text>
                            <Text style={[globalStyles.whiteText,{paddingHorizontal:10,marginVertical:3}]}>Pin to your profile</Text>
                            <Text style={[globalStyles.whiteText,{paddingHorizontal:10,marginVertical:3}]}>Archive</Text>
                            <Text style={[globalStyles.whiteText,{paddingHorizontal:10,marginVertical:3}]} onPress={deletePost} >Delete</Text>
                            <Text style={[globalStyles.whiteText,{paddingHorizontal:10,marginVertical:3}]}>Edit</Text>
                            <Text style={[globalStyles.whiteText,{paddingHorizontal:10,marginVertical:3}]}>Hide like count</Text>
                            <Text style={[globalStyles.whiteText,{paddingHorizontal:10,marginVertical:3}]}>Turn off commenting</Text>
                        </>
                            :
                        <>
                        </>
                        }
                </BottomDrawer>
            }
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
        <TouchableHighlight style={{width:'100%',height:450}}>
            <CachedImage styles={styles.postImg} downloadUrl={fileUrls[0]}/>
        </TouchableHighlight>
        )
    useEffect(() => {
      
    
      return () => {
        
      }
    }, [])
    
    return (
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
    const [like, setlike] = useState<Like>();
    const [saved, setSaved] = useState<boolean>(false);
    const [pagerIndexState, setPagerIndexState] = useState<number>(0);

    const navigation = useNavigation<StackNavigationProp<mainStackParamList,"home">>();
    const {state} = useUserContext();
    const likePost = () => {
        if(!like){
            postData.likesCount++;
            createLike({
                likeId :'',
                targetType : 'post',
                targetId : postData.postId,
                appUser : state.user!
            }).then(setlike)
        }else{
            postData.likesCount--;
            deleteLike(like)
            .then(()=>setlike(undefined));
        }
    }
    return(
        <View>
            <PostImage postData={postData} setPagerIndexState={setPagerIndexState}/>
            
            <View style={styles.headerContainer}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Icon 
                        name={ like ? 'heart' : 'heart-o'} 
                        style={like ? styles.footerIconHeart : styles.footerIcon}
                        onPress={likePost}/>
                    <Icon name='comment-o' style={styles.footerIcon} 
                        onPress={()=> navigation.navigate('comments',{post : postData})}/>
                    <Icon name='paper-plane-o' style={styles.footerIcon}/>
                </View>
                {
                    postData.fileUrls.length > 1 && 
                        <PostPagerIndicator 
                            pageCount={postData.fileUrls.length} 
                            activePage={pagerIndexState}/>
                }
                <Icon name={saved ? 'bookmark' : 'bookmark-o'} 
                    style={styles.footerIcon}
                    onPress={()=>{setSaved(!saved)}}/>
            </View>

            <View style={{paddingHorizontal:15}}>
                <Text style={[globalStyles.whiteText,globalStyles.boldText]} onPress={()=>navigation.navigate('likes',{post : postData})}>
                    {postData.likesCount} likes
                </Text>
                <Text style={globalStyles.whiteText}>
                    <Text style={globalStyles.boldText}>{postData.appUser.username}</Text>
                    {` ${postData.caption}`}
                </Text>
                {
                    postData.commentCount > 1 ? 
                    <Text style={globalStyles.lightGreyText} onPress={()=> navigation.navigate('comments',{post : postData})}>{`view all ${postData.commentCount} comments`}</Text> :
                    postData.commentCount == 1 &&
                    <Text style={globalStyles.lightGreyText} onPress={()=> navigation.navigate('comments',{post : postData})}>{`view ${postData.commentCount} comment`}</Text>
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
    footerIconHeart : {
        fontSize : 25,
        marginHorizontal : 6,
        color : 'red'
    },
    drawerCircleButton : {
        width : 75,
        height : 75,
        borderRadius : 50,
        backgroundColor : 'transparent',
        borderWidth : 1,
        borderColor : '#A09A9A',
        color : 'white',
        fontSize : 30,
        fontWeight : '200',
        textAlign : 'center',
        textAlignVertical: 'center'
    }
})

export default Feeds