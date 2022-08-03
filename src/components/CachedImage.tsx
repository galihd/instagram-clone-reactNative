import { View, Text, Image, StyleProp, ImageStyle, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import hash from 'object-hash'
import * as FileSystem from 'expo-file-system';
import { globalStyles } from '../../AppStyle';

const CachedImage : React.FC<{downloadUrl : string,styles : StyleProp<ImageStyle>,loadingIndicatorShow? : boolean}> = ({downloadUrl,styles,loadingIndicatorShow=false}) => {
    const [cachedUri, setCachedUri] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const cacheImage = async () => {
            const hashName = hash.sha1(downloadUrl)
            const path = `${FileSystem.cacheDirectory}${hashName}`;
            const cachedFile = await FileSystem.getInfoAsync(path);
            if(!cachedFile.exists){
                console.log("downloading image");
                await FileSystem.downloadAsync(downloadUrl,path);
            }

            setCachedUri(path)
            setIsLoading(false);
        }


        cacheImage();

        return ()=>{
            
        }

      
    }, [])
    


  return (
    <>  
        {
        (loadingIndicatorShow && isLoading) && 
            <View style={[styles,{justifyContent:'center'}]}>
                <ActivityIndicator size={'large'} color={'#999999'}/>
            </View>
        } 
        <Image 
            source={{uri : cachedUri}} 
            style={styles} />
    </>
            
)
  
}

export default CachedImage