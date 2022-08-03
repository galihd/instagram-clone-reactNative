import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { Video } from "expo-av"
import { FlatList, TouchableHighlight } from "react-native"
import { globalStyles, gridStyle } from "../../../AppStyle"
import { Post } from "../../types/modeltypes"
import { mainStackParamList } from "../../types/navtypes"
import CachedImage from "../CachedImage"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const ReelsTab : React.FC<{userPosts : Post[]}> = ({userPosts}) => {
    const navigation = useNavigation<StackNavigationProp<mainStackParamList,"profile">>()
  
    return (
      <FlatList 
        style={globalStyles.darkContainer} 
        numColumns={3}
        data={userPosts}
        keyExtractor={item => item.postId}
        renderItem={
          ({item})=>
            <TouchableHighlight onPress={()=> navigation.navigate('ProfilePost',{posts : userPosts})}>
                <>
                <Video source={{uri : item.fileUrls[0]}} style={gridStyle.standardGridImage}/>
                <Icon name='play-outline' style={gridStyle.GridVideoBadge}/>
                </>
            </TouchableHighlight>
        }
      />
    )
  }
  
  export default ReelsTab