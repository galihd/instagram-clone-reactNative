import { Dimensions, Image, SectionList, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as MediaLibrary from 'expo-media-library'
import IconButton from '../IconButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { CameraCapturedPicture } from 'expo-camera';
import { globalStyles, gridStyle } from '../../../AppStyle';
import { ResizeMode, Video } from 'expo-av';


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

    const [videoSelected, setvideoSelected] = useState<boolean>(false)

    const touchFileHandler = (file : MediaLibrary.Asset) =>{
      setPreviewFile(file as MediaLibrary.Asset);
      if(file){
        //prevent upload multiple video due to bandwidth
        if(file.mediaType === MediaLibrary.MediaType.video)
          setvideoSelected(true)

        if(allowMultiple && selectedFilesState && file.mediaType === MediaLibrary.MediaType.photo){
          (selectedFilesState as Array<MediaLibrary.Asset>).includes(file) ?
            selectedFilesState.length>1 && setSelectFileFunction(prev => (prev as MediaLibrary.Asset[]).filter(selected => selected != file))
          :
            setSelectFileFunction(prev => [...prev as Array<MediaLibrary.Asset>,file])
        }else{
          setSelectFileFunction([file]);
          if(file.mediaType === MediaLibrary.MediaType.photo)
            setvideoSelected(false);
        }
      }
    }

    
    useEffect(() => {
      if(videoSelected)
        setAllowMultiple(false)
    
      
    }, [allowMultiple,videoSelected])
    
    
    
    useEffect(() => {
      if(assets){
        touchFileHandler(assets[0])
      }
    }, [assets])
    
  const chunkArray = (myArray : MediaLibrary.Asset[], chunk_size : number) => {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        let myChunk = myArray.slice(index, index+chunk_size);
        tempArray.push(myChunk);
    }

    return tempArray;
  }
  return (
      <SectionList
        stickySectionHeadersEnabled
        sections={[{
          title :'header',
          data : chunkArray(assets,4)
        }]}
        ListHeaderComponent={previewFile && <PreviewPane previewFile={previewFile}/>}
        style={[globalStyles.darkContainer,{flex:1,height:height-200}]}
        keyExtractor={(item,index) => `${item[0].id}-${index}`}
        renderSectionHeader={({section})=> <>
          {(showUtility)&& 
            <View style={styles.utilityBar}>
              <View style={{backgroundColor: allowMultiple ? 'grey' : 'black'}}>
                <IconButton iconName='card-multiple' btnSize='medium' pressFunction={()=>setAllowMultiple(!allowMultiple)}>
                  <Text style={{color:'white',marginRight:25,fontSize:10}}>SELECT MULTIPLE</Text>
                </IconButton>
              </View>
              <IconButton iconName='camera' btnSize='medium' pressFunction={closeFunction}/>
            </View>
          }
        </>}
        renderItem={
          ({item})=> 
          <View style={{flexDirection:'row'}}>
             {item.map(itemData => <_renderItem key={itemData.id}
              Item={itemData} 
              pressHandler={()=>touchFileHandler(itemData)} 
              isSelected={selectedFilesState ? (selectedFilesState as Array<MediaLibrary.Asset>).includes(itemData) : false}/>)}
          </View>
      }
      />
  )
}

class _renderItem extends React.PureComponent<{
  Item : MediaLibrary.Asset
  isSelected : boolean
  pressHandler : () => void
}>{
  
  render(): React.ReactNode {
    const {Item,isSelected,pressHandler} = this.props
    return(
      <TouchableHighlight onPress={pressHandler} 
          style={isSelected && gridStyle.selectedGridTouchable}>
          {
            Item.mediaType === 'photo' ?
            <Image source={{uri : Item.uri}} style={
              isSelected ? gridStyle.selectedGridImage : gridStyle.smallGridImage}/> 
              :
            <View>
              <Image source={{uri : Item.uri}} style={isSelected ? gridStyle.selectedGridImage : gridStyle.smallGridImage}/> 
              <Icon name='play-outline' style={gridStyle.GridVideoBadge}/>
            </View>
            
          }
        </TouchableHighlight>
    )
  }
}

const PreviewPane : React.FC<{previewFile : MediaLibrary.Asset | undefined}> = ({previewFile})=>{
    return(
      <View style={styles.PreviewContainer}>
        {
          previewFile?.mediaType === 'photo' ?
          <Image source={{uri : previewFile!.uri}} style={{width:'100%',height:'100%',resizeMode:'contain'}} />
          :
          <Video 
                useNativeControls
                source={{uri : previewFile!.uri}} 
                style={{width:'100%',height:'100%'}} 
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                />

        }
      </View>
    )
  }

  const UtilityBar = () => {
    
  }

export default GallerySelector

const styles = StyleSheet.create({
  PreviewContainer : {
    maxHeight : height/2,
    width : width
  },
  utilityBar:{
    flexDirection:'row',
    backgroundColor :'black',
    justifyContent:'flex-end',
    alignItems:'center',
    width:'100%',
    paddingHorizontal:20,
    paddingVertical: 5
  }
})