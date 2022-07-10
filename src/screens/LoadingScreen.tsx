import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { rootStackParamList } from '../types/navtypes';
import { useUserContext } from '../contexts/UserContexts';

const LoadingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<rootStackParamList,"loading">>()
  const {state,dispatch} = useUserContext();
  
  useEffect(() => {
    if(state.isAuthenticated){
      navigation.navigate("main")
    }else{
      navigation.navigate("signIn")
    }
  }, [])
  return (
    <View>
      <Image style={styles.loadingImage} source={require("../../assets/ig-meta.jpg")}/>
    </View>
  )
}

export default LoadingScreen

const styles = StyleSheet.create({
  loadingImage : {
    width:'100%',
    height:'100%'
  }
})