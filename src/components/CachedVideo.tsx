import { View, Text, StyleProp, ViewStyle, TouchableOpacity } from 'react-native'
import React, { useEffect,useState } from 'react'
import { ResizeMode, Video } from 'expo-av'
import objectHash from 'object-hash'
import * as FileSystem from 'expo-file-system';
import { useFeedContext } from '../contexts/FeedContexts';


type prop = {
    source : string
    style : StyleProp<ViewStyle>
}
const CachedVideo  = React.forwardRef<Video,prop> (({source,style},ref) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cachedUri, setcachedUri] = useState<string>('')
    const {state,dispatch} = useFeedContext()
    useEffect(() => {

      const cacheVideo =async () => {
        const hash = objectHash.sha1(source);
        const path = `${FileSystem.cacheDirectory}${hash}`
        const cachedFile = await FileSystem.getInfoAsync(path);
        if(!cachedFile.exists){
            console.log("download video");
            await FileSystem.downloadAsync(source,path);
        }


        setcachedUri(path)
        setIsLoading(false);
      }
    
      cacheVideo();
    }, [])
    
  return (
    <TouchableOpacity activeOpacity={1}>
      <Video
        style={style}
        ref={ref}
        source={{uri : cachedUri}}
        resizeMode={ResizeMode.CONTAIN}
        isMuted={state.isMuted}
        isLooping />
    </TouchableOpacity>
  )
})

export default CachedVideo