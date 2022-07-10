import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeStack from './HomeStack';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useUserContext } from '../contexts/UserContexts';


const MainNavigation = () => {
    const Tabs = createMaterialBottomTabNavigator(); 
    const {state} = useUserContext();
  return (
    <Tabs.Navigator
            barStyle={{backgroundColor:'black'}}
            shifting={false}
            labeled = {false}
            activeColor='white'
            inactiveColor='black'
            >
    <Tabs.Screen name='Home' component={HomeStack} options={{
        tabBarIcon : ({color}) => <Icon name={color === 'black' ? 'home-outline' : 'home'} style={color === 'white' ? styles.barIconA : styles.barIcon}/>,
    }}/>
    <Tabs.Screen name='Search' component={ExploreScreen} options={{
        tabBarIcon : ({color}) => <Icon name={color === 'black' ? 'magnify' : 'magnify'}  style={color === 'white' ? styles.barIconA : styles.barIcon}/>,
    }}/>
    <Tabs.Screen name='Reels' component={ExploreScreen} options={{
        tabBarIcon : ({color}) => <Icon name={color === 'black' ? 'movie-open-play-outline' : 'movie-open-play'}  style={color === 'white' ? styles.barIconA : styles.barIcon}/>,
    }}/>
    <Tabs.Screen name='Shop' component={ExploreScreen} options={{
        tabBarIcon : ({color}) => <Icon name={color === 'black' ? 'shopping-outline' : 'shopping'}  style={color === 'white' ? styles.barIconA : styles.barIcon}/>,
    }}/>
    <Tabs.Screen name='Profile' component={ProfileScreen} options={{
        tabBarIcon : ({color}) => state.user?.avatarUrl ? <Image style={styles.imgDisplay} source={{uri : state.user.avatarUrl}}/> : <Icon name='account' style={styles.barIcon}/>,
    }}/>
</Tabs.Navigator>
  )
}

export default MainNavigation

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      imgDisplay : {
        width:25,
        height:25,
        borderRadius:50,
        resizeMode:'contain'
      },
      barIcon : {
          fontSize : 25,
          fontWeight : '100',
          color : 'white'
      },
      barIconA: {
          fontSize : 28,
          fontWeight : '300',
          color : 'white'
      }
})