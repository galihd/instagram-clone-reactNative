import {Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type btnProps = {
    btnSize : "small" | "medium" | "large"
    iconName : string
    pressFunction? : ()=>void
}

const IconButton : React.FC<btnProps>= ({btnSize,iconName,pressFunction,children}) => {
  return (
    <TouchableOpacity onPress={pressFunction} style={{flexDirection:'row',alignItems:'center'}}>
      <Icon name={iconName}
        style={{
            fontSize : btnSize === 'large' ? 30 : btnSize === 'medium' ? 25 : 15,
            color : 'white',
            padding : 5,
            textAlign : 'center',
            textAlignVertical : 'center'
        }}
      />
      {children}
    </TouchableOpacity>
  )
}

export default IconButton
