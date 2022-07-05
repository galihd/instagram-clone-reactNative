import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AuthStack from './AuthStack'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import HomeScreen from '../screens/HomeScreen'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ExploreScreen from '../screens/ExploreScreen'
import ProfileScreen from '../screens/ProfileScreen'
import HomeStack from './HomeStack'


const MainContainer = () => {
    const Tabs = createMaterialBottomTabNavigator();
    return (
        <NavigationContainer>
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
                <Tabs.Screen name='Reels' component={HomeScreen} options={{
                    tabBarIcon : ({color}) => <Icon name={color === 'black' ? 'movie-play-outline' : 'movie-play'}  style={color === 'white' ? styles.barIconA : styles.barIcon}/>,
                }}/>
                <Tabs.Screen name='Shop' component={HomeScreen} options={{
                    tabBarIcon : ({color}) => <Icon name={color === 'black' ? 'shopping-outline' : 'shopping'}  style={color === 'white' ? styles.barIconA : styles.barIcon}/>,
                }}/>
                <Tabs.Screen name='Profile' component={ProfileScreen} options={{
                    tabBarIcon : ({color}) => <Image style={styles.imgDisplay} source={{uri : "https://source.unsplash.com/random/800x800/?img=69"}}/>,
                }}/>
            </Tabs.Navigator>
        </NavigationContainer>
    )
}

export default MainContainer

const styles = StyleSheet.create({
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