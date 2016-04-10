'use strict';

import React from 'react-native';
import yelp from './../lib/yelp_api';
import SearchResults from './SearchResults';
import tempJson from './tempJson.json';

const {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicatorIOS,
    Image,
    Component,
    Dimensions,
    DeviceEventEmitter,
    LayoutAnimation
} = React;

var windowHeight = Dimensions.get('window').height;

var KEYBOARD_MARGIN = 220;

var DESCRIPTION_MARGIN = 5;
var DESCRIPTION_FONT = 16;
var INPUTS_MARGIN = 0;
var TITLE_MARGIN = 160;
var TITLE_FONT_SIZE = 52;
console.log(windowHeight);

if(windowHeight <=  480) {
  //iphone 4s size is default, 480 pixels
};

if(windowHeight > 480 && windowHeight <= 568) {
  //iphone 5: 568 pixels
    TITLE_MARGIN = 195;
    TITLE_FONT_SIZE = 60;
};

if(windowHeight > 568 && windowHeight <= 667 ) {
  //iphone 6: 667 pixels
    TITLE_MARGIN = 255;
    TITLE_FONT_SIZE = 70;
    DESCRIPTION_MARGIN = 10;
};

if(windowHeight > 667 && windowHeight <= 736) {
  //iphone 6 plus: 736 pixels
    TITLE_MARGIN = 310;
    TITLE_FONT_SIZE = 74;
    DESCRIPTION_MARGIN = 40;
    DESCRIPTION_FONT = 20;
};
 

class SearchPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            isLoading: false,
            message: '',
            description: 'Search for rescue shelters by city or zip code',
            visibleHeight: windowHeight,
            keyboardMargin: 0,
            titleMargin: TITLE_MARGIN 
        };
    }
    componentWillMount() {
      DeviceEventEmitter.addListener('keyboardWillShow', this.showKeyboard.bind(this));
      DeviceEventEmitter.addListener('keyboardWillHide', this.hideKeyboard.bind(this));
    }

    onSearchTextChanged(event) {
        this.setState({ searchString: event.nativeEvent.text });
    }

    showKeyboard(event) {
      LayoutAnimation.configureNext(animations.layout.easeInEaseOut);
      this.setState({ 
        keyboardMargin: KEYBOARD_MARGIN,
        titleMargin: TITLE_MARGIN - KEYBOARD_MARGIN
      });
    }

    hideKeyboard() {
      LayoutAnimation.configureNext(animations.layout.easeInEaseOut);
      this.setState({ 
        keyboardMargin: 0,
        titleMargin: TITLE_MARGIN
      });
    }

    _executeQuery(query) {
        this.setState({ isLoading: true });
        fetch(query)
            .then(response => response.json())
            .then(json => this._handleResponse(json))
            .catch(error =>
                this.setState({
                    isLoading: false,
                    message: 'Please try again. ' + error
                }));
    }

    onSearchPressed() {
        var query = yelp.request_yelp(this.state.searchString);
        this._executeQuery(query);
    }

    onLocationPressed() {
        navigator.geolocation.getCurrentPosition(
            location => {
                const search = location.coords.latitude + ',' + location.coords.longitude;
                console.log(search);
                this.setState({ searchString: ''});
                const query = yelp.request_yelp(search);
                this._executeQuery(query);
            },
            error => {
              console.log('error');
                this.setState({
                    message: 'GPS currently unavailable.'
                });
                console.log(error);
            });
    }

    _handleResponse(response) {
        this.setState({ isLoading: false, message: '', description: 'Search for rescue shelters by city or zip code'});
        if (response.total > 0) {
            this.props.navigator.push({
                title: 'Results',
                component: SearchResults,
                passProps: { results: response.businesses }
            });
        } else {
            this.setState({ description: 'Results not found; try broadening your search.'});
        }
    }

    render() {
        var spinner = this.state.isLoading ?
            ( <ActivityIndicatorIOS
                color='white'
                style={styles.indicator}
                hidden='true'
                size='large'/>) :
            (<View style={styles.indicator}/>);
        return (
        <Image style={styles.container} source={{ uri: 'tanpuppy', isStatic: true}}>
            <View style={[styles.content, {marginBottom: this.state.keyboardMargin}]}>
                <Text style={styles.bigTitle}>
                  Save a </Text>
                  <Text style={[styles.bigTitle2, {marginBottom: this.state.titleMargin}]}>
                  stray
                </Text>
                {spinner}
                    <View style={styles.flowRight}>
                    <TextInput
                        ref="TextInput"
                        style={styles.searchInput}
                        value={this.state.searchString}
                        autoCorrect={false}
                        onSubmitEditing={this.onSearchPressed.bind(this)}
                        onChange={this.onSearchTextChanged.bind(this)}
                        returnKeyType={'search'}
                        onFocus={this.showKeyboard.bind(this)}
                        keyboardType={"default"}
                        keyboardAppearance={"dark"}
                        placeholderTextColor= 'rgba(171, 163, 149, 1)'
                        selectionColor= 'rgba(255, 251, 246, 1)'
                        placeholder='City or zip code'/>


                    <TouchableHighlight 
                      onPress={this.onSearchPressed.bind(this)}
                      style={styles.button}>
                        <Text 
                            style={styles.buttonText}
                        >Go</Text>
                    </TouchableHighlight>
                </View>
                <TouchableHighlight style={styles.button}
                    onPress={this.onLocationPressed.bind(this)}>
                     <Text style={styles.buttonText}>Current Location</Text>
               </TouchableHighlight> 
               <View style={styles.descriptionContainer}>
                  <Text style={styles.description}>
                  { this.state.description }
                  </Text>
                </View>
            </View>
            </Image>
        );
    }
};

var ButtonInputHeight = 46;
var ButtonUnderlayColor = 'rgba(171, 199, 212)';

var animations = {
    layout: {
        spring: {
            duration: 400,
            create: {
              duration: 300,
              type: LayoutAnimation.Types.easeInEaseOut,
              property: LayoutAnimation.Properties.opacity,
            },
        update: {
            type: LayoutAnimation.Types.spring,
            springDamping: 400,
          },
    },
    easeInEaseOut: {
       duration: 400,
       create: {
         type: LayoutAnimation.Types.easeInEaseOut,
         property: LayoutAnimation.Properties.scaleXY,
       },
       update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        },
     },
    },
};

  

 
var styles = StyleSheet.create({
    bigTitle: {
        fontSize: TITLE_FONT_SIZE,
        fontFamily: 'Open Sans',
        textAlign: 'center',
        color: 'rgba(255, 251, 246, 1)',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 12,
        paddingBottom: 0,
        
    },
    bigTitle2: {
        fontFamily: 'Open Sans',
        fontSize: TITLE_FONT_SIZE,
        textAlign: 'center',
        color: 'rgba(255, 251, 246, 1)',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 12,
        lineHeight: TITLE_FONT_SIZE - 5, 
    },
    descriptionContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 251, 246, 0.4)',
        paddingTop: 3,
        marginTop: 0,
        marginBottom: DESCRIPTION_MARGIN,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    description: {
        fontFamily: 'Open Sans',
        fontSize: DESCRIPTION_FONT,
        textAlign: 'center',
        color: 'rgba(25, 19, 15, 1)',
        lineHeight: DESCRIPTION_FONT
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    content: {
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: 'rgba(0,0,0,0)',
        flexDirection: 'column',
        alignItems: 'center',
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Open Sans',
        color: 'rgba(255, 251, 246, 1)',
        alignSelf: 'center'
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        height: ButtonInputHeight,
        backgroundColor: 'rgba(1,1,1,0.5)',
        borderRadius: 2,
        marginBottom: 8,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    searchInput: {
        height: ButtonInputHeight,
        padding: 4,
        marginRight: 8,
        flex: 4,
        fontFamily: 'Open Sans',
        fontSize: 20,
        backgroundColor: 'rgba(1,1,1,0.5)',
        borderRadius: 2,
        color: 'rgba(255, 251, 246, 1)',
        paddingLeft: 15,
    },
    indicator: {
        marginTop: 0,
        marginBottom: 10,
        width: 38,
        height: 38
    }
});

module.exports = SearchPage;

               //<Image source={require('image!doghelp')} style={styles.image}/>
