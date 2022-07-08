import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import {users} from "../../dummieData/Data"
const Stories = () => {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {users.map((story,index) => 
                <View style={styles.storyItem} key={index}>
                    <Image source={{uri : story.image}} style={styles.storyImg}/>
                    <Text numberOfLines={1} style={{color : 'white',fontSize:10}}>{story.username}</Text>
                </View>
            )}
      </ScrollView>
    </View>
  )
}

export default Stories

const styles = StyleSheet.create({
    storyItem : {
        justifyContent : 'center',
        alignItems : 'center',
        marginLeft: 6,
        textAlign : 'center',
        width : 75,
        height : 75,
        marginBottom : 10
    },
    storyImg : {
        width : 55,
        height : 55,
        borderRadius : 50
    }
})