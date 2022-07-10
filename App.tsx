import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Image, StyleSheet } from 'react-native';
import HomeStack from './src/navigations/HomeStack';

import ExploreScreen from './src/screens/ExploreScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserContext from './src/contexts/UserContexts';
import RootStackNavigation from './src/navigations/RootStackNavigation';


export default function App() {
  
  return (
    <UserContext>
      <RootStackNavigation/>
    </UserContext>
  );
}

const styles = StyleSheet.create({

});
