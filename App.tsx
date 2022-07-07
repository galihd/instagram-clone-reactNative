import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import HomeStack from './src/navigations/HomeStack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ExploreScreen from './src/screens/ExploreScreen';
import ProfileScreen from './src/screens/ProfileScreen';


export default function App() {
  const Tabs = createMaterialBottomTabNavigator();
  return (
    <NavigationContainer>
            <StatusBar
              animated={true}
              backgroundColor="black"
              hidden={false} 
            />
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
                    tabBarIcon : ({color}) => <Image style={styles.imgDisplay} source={{uri : "https://source.unsplash.com/random/800x800/?img=69"}}/>,
                }}/>
            </Tabs.Navigator>
        </NavigationContainer>
  );
}

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
});
