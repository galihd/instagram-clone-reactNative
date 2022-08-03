import { View, Text, TouchableHighlight, Dimensions, StyleSheet } from 'react-native'
import React, { SetStateAction, useEffect } from 'react'
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view'
import CachedImage from '../CachedImage'
import { Post } from '../../types/modeltypes'


const {width} = Dimensions.get('window');

const PostImage : React.FC<{
    postData : Post
    setPagerIndexState : React.Dispatch<SetStateAction<number>>
}> = ({postData : {fileUrls},setPagerIndexState}) => {
    
    if(fileUrls.length === 1)
        return (
        <TouchableHighlight style={{width:'100%',height:450}}>
            <CachedImage styles={styles.postImg} downloadUrl={fileUrls[0]} loadingIndicatorShow />
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
                            <CachedImage styles={styles.postImg} downloadUrl={fileUrl}/>
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

export {PostImage,PostPagerIndicator}

const styles = StyleSheet.create({
    postImg : {
        width : "100%",
        height : "100%",
        resizeMode : 'cover'
    }
})