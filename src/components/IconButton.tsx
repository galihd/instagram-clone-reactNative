import {Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type btnProps = {
    btnSize : "small" | "medium" | "large"
    iconName : string
    pressFunction? : ()=>void
}

const IconButton : React.FC<btnProps>= ({btnSize,iconName,pressFunction}) => {
  return (
    <TouchableOpacity onPress={pressFunction}>
      <Icon name={iconName}
        style={{
            fontSize : btnSize === 'large' ? 30 : btnSize === 'medium' ? 25 : 15,
            color : 'white',
            padding : 5,
            textAlign : 'center',
            textAlignVertical : 'center'
        }}
      />
    </TouchableOpacity>
  )
}

export default IconButton
