import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const {width,height} = Dimensions.get('window');
const FormContainer : React.FC<{children? : React.ReactNode}> = ({children}) => {
  return (
    <View style={styles.FormContainer}>
      {children}
    </View>
  )
}

export default FormContainer

const styles = StyleSheet.create({
    FormContainer : {
        flex:1,
        justifyContent : 'center',
        width : width,
        paddingHorizontal : 30,
        backgroundColor : 'black'
    }
})