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

let windowHeight = Dimensions.get('window').height;
let KEYBOARD_MARGIN = 220;

let DESCRIPTION_MARGIN = 5;
let DESCRIPTION_FONT = 16;
let INPUTS_MARGIN = 0;
let TITLE_MARGIN = 160;
let TITLE_FONT_SIZE = 52;
console.log('window height', windowHeight);

if(windowHeight <=  480) {
  //iphone 4s size is default, 480 pixels
};

if(windowHeight > 480 && windowHeight <= 568) {
  //iphone 5: 568 pixels
    TITLE_MARGIN = 195;
    TITLE_FONT_SIZE = 60;
    DESCRIPTION_MARGIN = 8;
};

if(windowHeight > 568 && windowHeight <= 667 ) {
  //iphone 6: 667 pixels
    TITLE_MARGIN = 255;
    TITLE_FONT_SIZE = 70;
    DESCRIPTION_FONT = 18;
    DESCRIPTION_MARGIN = 24;
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
            descriptionStyle: styles.description,
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
        keyboardMargin: KEYBOARD_MARGIN
      });
    }

    hideKeyboard() {
      LayoutAnimation.configureNext(animations.layout.easeInEaseOut);
      this.setState({ 
        keyboardMargin: 0
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
        this.setState({ isLoading: false, message: '', description: 'Search for rescue shelters by city or zip code', descriptionStyle: styles.description});
        if (response.total > 0) {
            this.props.navigator.push({
                title: 'Results',
                component: SearchResults,
                passProps: { results: response.businesses }
            });
        } else {
            this.setState({ description: 'Hmmm that didn\'t work. Try again.', descriptionStyle: styles.tryAgain});
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
        <Image style={styles.container} source={{ uri: 'bluepuppy', isStatic: true}}>
            <View style={[styles.content], {marginBottom: this.state.keyboardMargin}}>

                {spinner}

                <TouchableHighlight style={styles.button} onPress={this.onLocationPressed.bind(this)}>
                    <Text style={styles.currentLocationText}>CURRENT LOCATION</Text>
                </TouchableHighlight> 

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
                        blurOnSubmit={false}
                        keyboardType={"web-search"}
                        keyboardAppearance={"default"}
                        placeholderTextColor= 'gray'
                        placeholder='City or zip code'
                    />

                    <TouchableHighlight 
                      onPress={this.onSearchPressed.bind(this)}
                      style={styles.goButton}>
                        <Text style={styles.buttonText}>Go</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.descriptionContainer}>
                  <Text style={this.state.descriptionStyle}>
                  { this.state.description }
                  </Text>
                </View>
            </View>
            </Image>
        );
    }
};

var ButtonInputHeight = 46;
var ButtonUnderlayColor = 'rgba(18,44,93,0.7)';

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

  
let PADDING = 40;
 
let styles = StyleSheet.create({
    descriptionContainer: {
        flex: 1,
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
        color: 'white',
        paddingLeft: PADDING,
        paddingRight: PADDING,
        backgroundColor: 'transparent',
        shadowColor: 'rgba(25, 19, 15, 1)',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 4,
        lineHeight: DESCRIPTION_FONT
    },
    tryAgain: {
        fontFamily: 'Open Sans',
        fontSize: DESCRIPTION_FONT,
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'transparent',
        paddingLeft: PADDING,
        paddingRight: PADDING,
        shadowColor: '#6B97D3',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 4,
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
        flexDirection: 'column',
        alignItems: 'center',
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: PADDING,
        marginLeft: PADDING,
    },
    currentLocationText: {
        color: '#122c5d',
        fontSize: 18,
        fontFamily: 'Open Sans',
        alignSelf: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Open Sans',
        color: 'white',
        alignSelf: 'center'
    },
    goButton: {
        flex: 1,
        flexDirection: 'row',
        height: ButtonInputHeight,
        backgroundColor: 'rgb(107,151,212)',
        borderRadius: 40,
        marginBottom: 8,
        marginLeft: 8,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        height: ButtonInputHeight,
        backgroundColor: '#b9c6d9',
        borderRadius: 1,
        marginRight: PADDING,
        marginLeft: PADDING,
        marginBottom: 8,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    searchInput: {
        height: ButtonInputHeight,
        padding: 4,
        flex: 6,
        fontFamily: 'Open Sans',
        fontSize: 20,
        backgroundColor: 'white',
        borderRadius: 2,
        color: 'black',
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
