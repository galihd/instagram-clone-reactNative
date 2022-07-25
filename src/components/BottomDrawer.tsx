import { Animated, Dimensions, Modal, PanResponder, StyleSheet, TouchableOpacity,} from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../../AppStyle'

const {height} = Dimensions.get('screen')

interface props {
    size? : 'large' | 'small'
    isOpen : boolean
    closeFuntion : ()=>void
}

const BottomDrawer : React.FC<props> = ({
    isOpen
    ,children
    ,closeFuntion
    ,size = 'large'
}) => {
    const panY = useState<Animated.Value>(new Animated.Value(height))[0]

    const panResponders = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => false,
        onPanResponderMove: Animated.event([null, {dy: panY}], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, gs) => {
          if ((gs.dy > 0 && gs.vy > 2) || gs.dy > height/4) {
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
        inputRange: [0,1],
        outputRange: [0,1]
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
        <TouchableOpacity activeOpacity={1} style={globalStyles.overlayContainer} onPress={closeHandler}>
          <Animated.View 
              style={[styles.container ,{
                transform : [{translateY : topInterpolate}],
                minHeight : size === 'large' ? height/2 : height/4
              }]}
              {...panResponders.panHandlers}
          >
            {children}
          </Animated.View>
        </TouchableOpacity>
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