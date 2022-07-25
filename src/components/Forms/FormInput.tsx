import { StyleSheet } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native'

interface formInputProps {
    placeholderText : string
    value : string
    onChangeHandle : (((text: string) => void) & Function)
    isPassword? : boolean
    variant? : "auth" | "profile"
}

const FormInput : React.FC<formInputProps> = ({placeholderText,value,onChangeHandle,isPassword,variant='auth'}) => {
  return (
      <TextInput
        secureTextEntry={isPassword && isPassword}
        onChangeText={onChangeHandle}
        placeholder={placeholderText}
        placeholderTextColor={'#A09A9A'}
        value={value}
        style={{
          borderRadius:5,
          paddingVertical: 15,
          paddingHorizontal: 5,
          marginBottom: 15,
          color : '#FFFFFF',
          width : '100%',
          height : 50,
          fontSize : 15,
          backgroundColor: variant==='auth' ? '#535050' : 'black',
          borderBottomColor : variant==='profile' ? 'white' : undefined ,
          borderBottomWidth : variant === 'profile' ? 1 : 0
          
        }}
      />
  )
}

export default FormInput

