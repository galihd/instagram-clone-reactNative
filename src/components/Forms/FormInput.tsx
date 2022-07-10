import { StyleSheet } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native'

interface formInputProps {
    placeholderText : string
    value : string
    onChangeHandle : (((text: string) => void) & Function)
    isPassword? : boolean
}

const FormInput : React.FC<formInputProps> = ({placeholderText,value,onChangeHandle,isPassword}) => {
  return (
      <TextInput
        secureTextEntry={isPassword && isPassword}
        onChangeText={onChangeHandle}
        placeholder={placeholderText}
        placeholderTextColor={'#A09A9A'}
        value={value}
        style={{
          borderRadius:5,
          padding: 15,
          marginBottom: 15,
          color : '#FFFFFF',
          width : '100%',
          height : 50,
          fontSize : 15,
          backgroundColor: '#535050'
        }}
      />
  )
}

export default FormInput

