import { Animated, Dimensions, Modal, PanResponder, StyleSheet, TouchableOpacity, View,} from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../../AppStyle'

const {height} = Dimensions.get('screen')

interface props {
    size? : 'large' | 'small'
    isOpen : boolean
    closeFuntion : ()=>void
    children : React.ReactNode
}

const BottomDrawer : React.FunctionComponent<props> = ({
    isOpen
    ,closeFuntion
    ,size = 'large'
    ,children
}) => {
    const panY = useState<Animated.Value>(new Animated.Value(height))[0]

    const panResponders = PanResponder.create({
        onStartShouldSetPanResponder : () => true,
        onPanResponderMove: Animated.event([null, {dy: panY}], {
          useNativeDriver: false,
        }),
        onPanResponderTerminationRequest: ()=>true,
        onPanResponderRelease: (_, gs) => {
          const closeArea = size === 'large' ? (height/2)-50 : (height-(height/4))-50 ;
          const clickOutside = (gs.dy < 1 && gs.dx < 1 && gs.moveY <closeArea);
          const swipeFast = (gs.dy > 0 && gs.vy > 2);
          const swipeDistance = gs.dy > height/4
          if (swipeFast || swipeDistance  || clickOutside) {
            return closeHandler();
          }
          return resetAnimation.start();
        }
      })

    const resetAnimation = Animated.timing(panY,{
        toValue : 0,
        duration : 200,
        useNativeDriver : true
    })
    const closeAnimation = Animated.timing(panY,{
        toValue : height,
        duration : 200,
        useNativeDriver : true
    })
    const topInterpolate = panY.interpolate({
        inputRange: [-1,0,1],
        outputRange: [0,0,1]
    });

    const closeHandler = ()=> closeAnimation.start(closeFuntion)

    useEffect(() => {
      if(isOpen)
        resetAnimation.start()
      return () => {
        
      }
    }, [isOpen])
    
  return (
    <Modal
        animationType='none'
        visible={isOpen}
        transparent
        onRequestClose={closeHandler}
    >
        <View style={globalStyles.overlayContainer} 
            {...panResponders.panHandlers}>
          <Animated.View 
              style={[styles.container ,{
                transform : [{translateY : topInterpolate}],
                minHeight : size === 'large' ? height/2 : height/4
              }]}
          >
            {children}
          </Animated.View>
        </View>
    </Modal>
  )
}

export default BottomDrawer

const styles = StyleSheet.create({
    container: {
        backgroundColor : '#2A2C33',
        paddingTop: 12,
        paddingHorizontal: 12,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        justifyContent : 'space-evenly'
      },
})