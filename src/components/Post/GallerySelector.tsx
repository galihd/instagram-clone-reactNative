import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as MediaLibrary from 'expo-media-library'
import IconButton from '../IconButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { CameraCapturedPicture } from 'expo-camera';
import { globalStyles, gridStyle } from '../../../AppStyle';


const {width,height} = Dimensions.get('window');

const GallerySelector : React.FC<{
    assets : Array<MediaLibrary.Asset>,
    selectedFilesState : MediaLibrary.Asset[] | CameraCapturedPicture[] | undefined,
    setSelectFileFunction : React.Dispatch<React.SetStateAction<MediaLibrary.Asset[] | CameraCapturedPicture[] | undefined>>
    showUtility? : boolean 
    closeFunction? : ()=>void,

  }> = ({assets,selectedFilesState,setSelectFileFunction,closeFunction,showUtility = true}) => {
    const [previewFile, setPreviewFile] = useState<MediaLibrary.Asset>();
    const [allowMultiple, setAllowMultiple] = useState<boolean>(false);

    const touchFileHandler = (file : MediaLibrary.Asset) =>{
      setPreviewFile(file as MediaLibrary.Asset);
      if(allowMultiple && selectedFilesState){
        (selectedFilesState as Array<MediaLibrary.Asset>).includes(file) ?
          selectedFilesState.length>1 && setSelectFileFunction(prev => (prev as MediaLibrary.Asset[]).filter(selected => selected != file))
        :
          setSelectFileFunction(prev => [...prev as Array<MediaLibrary.Asset>,file])
      }else{
        setSelectFileFunction([file]);
      }
    }

    
    useEffect(() => {
      if(assets){
        setSelectFileFunction([assets[0]])
        setPreviewFile(assets[0])
      }
    }, [assets])
    
  
  return (
    <>
        <PreviewPane previewFile={previewFile}/>
        

        {
          assets && 
          <FlatList 
            ListHeaderComponent={
              showUtility ?
              <View style={styles.utilityBar}>
                <View style={{backgroundColor: allowMultiple ? 'grey' : 'black'}}>
                  <IconButton iconName='card-multiple' btnSize='medium' pressFunction={()=>setAllowMultiple(!allowMultiple)}>
                    <Text style={{color:'white',marginRight:25,fontSize:10}}>SELECT MULTIPLE</Text>
                  </IconButton>
                </View>
                <IconButton iconName='camera' btnSize='medium' pressFunction={closeFunction}/>
              </View> : undefined
            }
            
            style={[globalStyles.darkContainer]}
            numColumns={3}
            data={assets}
            keyExtractor={(p) => p.id}
            renderItem={
              ({item,index})=> 
              <TouchableHighlight key={index} onPress={()=>touchFileHandler(item)} 
              style={(selectedFilesState && (selectedFilesState as Array<MediaLibrary.Asset>).includes(item)) && gridStyle.selectedGridTouchable}>
              {
                item.mediaType === 'photo' ?
                <Image source={{uri : item.uri}} style={
                  selectedFilesState && 
                  ((selectedFilesState as Array<MediaLibrary.Asset>).includes(item)) ? 
                    gridStyle.selectedGridImage : gridStyle.standardGridImage}/> 
                  :
                <View>
                  <Image source={{uri : item.uri}} style={gridStyle.standardGridImage}/> 
                  <Icon name='play-outline' style={gridStyle.GridVideoBadge}/>
                </View>
              }
            </TouchableHighlight>
          }
          />
        }
      </>
  )
}

const PreviewPane : React.FC<{previewFile : MediaLibrary.Asset | undefined}> = ({previewFile})=>{
    return(
      <View style={styles.PreviewContainer}>
        {
          previewFile?.mediaType === 'photo' ?
          <Image source={{uri : previewFile!.uri}} style={{width:'100%',height:'100%',resizeMode:'contain'}} />
          :
          <View>
            {/* TO DO : PLAYING VIDEOS PREVIEW */}
          </View>
        }
      </View>
    )
  }
  

export default GallerySelector

const styles = StyleSheet.create({
  PreviewContainer : {
    height : height/2,
    width : width
  },
  utilityBar:{
    flexDirection:'row',
    backgroundColor :'black',
    justifyContent:'flex-end',
    alignItems:'center',
    width:'100%',
    paddingHorizontal:20,
    paddingVertical:5
  }
})