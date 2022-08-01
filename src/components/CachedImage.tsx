import { View, Text, Image, StyleProp, ImageStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
import hash from 'object-hash'
import * as FileSystem from 'expo-file-system';

const CachedImage : React.FC<{downloadUrl : string,styles : StyleProp<ImageStyle>}> = ({downloadUrl,styles}) => {
    const [cachedUri, setCachedUri] = useState<string>();

    useEffect(() => {
    const hashName = hash.sha1(downloadUrl)
    const path = `${FileSystem.cacheDirectory}${hashName}`;
        
        const cacheImage = async () => {
            const cachedFile = await FileSystem.getInfoAsync(path);
            if(cachedFile.exists){
                setCachedUri(cachedFile.uri)
            }else{
                console.log("downloading image");
                const newImage = await FileSystem.downloadAsync(downloadUrl,path);
                setCachedUri(newImage.uri)
            }
        }


        cacheImage();

        return ()=>{
            
        }

      
    }, [])
    
  return <Image source={{uri : cachedUri}} style={styles}/>
  
}

export default CachedImage