import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type btnProps = {
    btnSize : "small" | "medium" | "large"
    iconName : string
    pressFunction? : ()=>void
    badgeNumber : number
}


const IconButtonBadged : React.FC<btnProps> = ({iconName,btnSize,badgeNumber,pressFunction}) => {
  return (
    <TouchableOpacity onPress={pressFunction}>
          <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{badgeNumber}</Text>
          </View>
          <Icon name={iconName} style={{
             fontSize : btnSize === 'large' ? 30 : btnSize === 'medium' ? 25 : 15,
             color : 'white',
             padding : 5,
             textAlign : 'center',
             textAlignVertical : 'center'
          }}/>
    </TouchableOpacity>
  )
}

export default IconButtonBadged

const styles = StyleSheet.create({
    unreadBadge : {
        position : 'absolute',
        backgroundColor : 'red',
        borderRadius : 60,
        padding : 1,
        right : 0,
        top : 0,
        zIndex : 1,
        alignItems :'center'
    },unreadBadgeText:{
        color:'white'
    }

})