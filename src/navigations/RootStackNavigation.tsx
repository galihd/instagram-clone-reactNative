import { Image, StatusBar,View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { createStackNavigator, StackNavigationOptions, TransitionPresets} from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { rootStackParamList } from '../types/navtypes'
import MainNavigation from './MainNavigation'
import SignInScreen from '../screens/auth/SignInScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import * as SplashScreen from 'expo-splash-screen';
import { useUserContext } from '../contexts/UserContexts'
import { loadActiveUserDataFromStorage, setRelation, signIn } from '../contexts/UserContexts/UserContextAction'
import {globalStyles} from '../../AppStyle'

const RootStackNavigation : React.FC = () => {
    const rootStack = createStackNavigator<rootStackParamList>();
    const [appIsReady, setAppIsReady] = useState(false);
    const {state,dispatch} = useUserContext();

    useEffect(() => {
      async function prepare() {
        try {
          // Keep the splash screen visible while we fetch resources
          await SplashScreen.preventAutoHideAsync();
          // Pre-load fonts, make any API calls you need to do here
          const activeUser = await loadActiveUserDataFromStorage()
          await signIn(activeUser)
          .then(dispatch)
          .then(()=>setRelation(activeUser.appUserId))
          .then(dispatch)
          .catch(err => console.log(err))


          
          
        } catch (e) {
          console.warn(e);
        } finally {
          // Tell the application to render
          setAppIsReady(true);
        }
      }
  
      prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
      if (appIsReady) {
        // This tells the splash screen to hide immediately! If we call this after
        // `setAppIsReady`, then we may see a blank screen while the app is
        // loading its initial state and rendering its first pixels. So instead,
        // we hide the splash screen once we know the root view has already
        // performed layout.
        await SplashScreen.hideAsync();
      }
    }, [appIsReady]);
  
    if (!appIsReady) {
      return (
      <View>
        <Image style={globalStyles.splashImage} source={require("../../assets/ig-meta.jpg")}/>
      </View>)
    }
    
  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <StatusBar
            animated={true}
            backgroundColor="black"
            hidden={false} 
      />
      <rootStack.Navigator initialRouteName={state.isAuthenticated ? 'main' : 'signIn'}>
          <rootStack.Screen name='main' component={MainNavigation} options={{headerShown:false}}/>
          <rootStack.Screen name='signIn' component={SignInScreen} options={{headerShown:false}}/>
          <rootStack.Screen name='signUp' component={RegisterScreen} options={{headerShown:false}}/>
      </rootStack.Navigator>
    </NavigationContainer>
  )
}

export default RootStackNavigation

