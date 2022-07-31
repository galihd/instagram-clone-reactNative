import {Pressable, TouchableOpacity} from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type btnProps = {
    btnSize : "small" | "medium" | "large" | number
    iconName : string
    pressFunction? : ()=>void
}

const IconButton : React.FC<btnProps>= ({btnSize,iconName,pressFunction,children}) => {
  return (
    <TouchableOpacity onPress={pressFunction} style={{flexDirection:'row',alignItems:'center'}}>
      <Icon name={iconName}
        style={{
            fontSize : btnSize === 'large' ? 30 : btnSize === 'medium' ? 25 : btnSize === 'small' ? 15 : btnSize,
            color : 'white',
            padding : 5,
            textAlign : 'center',
            textAlignVertical : 'center',
        }}
      />
      {children}
    </TouchableOpacity>
  )
}

export default IconButton
