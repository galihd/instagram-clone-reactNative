import { Dimensions, StyleSheet} from 'react-native'

const {height,width} = Dimensions.get('screen')

export const globalStyles = StyleSheet.create({
    splashImage : {
        width:'100%',
        height:'100%'
    },
    igLogo :{
        tintColor : 'white',
        width : 100,
        height : 50,
        resizeMode : 'stretch'  
    },
    darkContainer : {
        flex :1,
        backgroundColor : 'black',
        width: width
    },
    overlayContainer : {
        flex :1,
        backgroundColor : 'rgba(0,0,0,0.2)',
        justifyContent : 'flex-end'
    },
    whiteTextSm:{
        fontSize : 12,
        color : 'white'
    },
    whiteText:{
        fontSize : 15,
        color : 'white'
    },
    whiteTextLg:{
        fontSize : 20,
        color : 'white'
    },
    lightGreyTextsm : {
        fontSize : 12,
        color : '#A09A9A',
    },
    lightGreyText : {
        fontSize : 15,
        color : '#A09A9A',
    },
    lightGreyTextlg : {
        fontSize : 20,
        color : '#A09A9A',
    },
    boldText : {
        fontWeight : '500'
    },
    linkText : {
        color : '#4285F4',
        textAlign:'center',
        fontSize : 15
    },
    linkTextsm : {
        color : '#4285F4',
        textAlign:'center',
        fontSize : 12
    },
    imgFullScreen: {
        width : width,
        height : height,
        resizeMode : 'cover'
    },
    flexRowSpaceAround : {
        flexDirection:'row',
        justifyContent :'space-around',
        alignItems : 'center'
    },
    headerBtn : {
        fontSize : 30,
        color : 'white',
        padding : 5,
        textAlign : 'center',
        textAlignVertical : 'center'
    }
})

export const gridStyle = StyleSheet.create({
    gridContentContainer : {
        flexDirection : 'row',
        flexWrap : 'wrap'
    },
    standardGridImage :{
        width : width/3,
        height : width/3,
        resizeMode : 'cover'
    },
    selectedGridTouchable : {
        padding :5,
        backgroundColor : 'white'
    },
    selectedGridImage : {
        width : (width/3)-10,
        height : (width/3)-10,
        resizeMode : 'cover',
    },
    GridVideoBadge:{
        position:'absolute',
        top:3,
        right:3,
        fontSize:40,
        fontWeight:'600',
    },
})



export const formStyle = StyleSheet.create({
    formsubmitButton : {
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
        marginBottom: 15,
        width : '100%',
        height : 50,
        fontSize : 15,
        backgroundColor: '#4285F4'
      },
    darkFormFooter : {
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        borderColor:'#535050',
        borderTopWidth:1,
        backgroundColor:'black',
        height:50
    }
})