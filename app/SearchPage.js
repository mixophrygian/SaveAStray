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
    DeviceEventEmitter
} = React;

class SearchPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchString: '91405',
            isLoading: false,
            message: '',
            visibleHeight: Dimensions.get('window').height,
            keyboardMargin: 0
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
      this.setState({ keyboardMargin: 180 });
    }

    hideKeyboard() {
      this.setState({ keyboardMargin: 0 });
    }

    _executeQuery(query) {
        this.setState({ isLoading: true });
        fetch(query)
            .then(response => response.json())
            .then(json => this._handleResponse(json))
            .catch(error =>
                this.setState({
                    isLoading: false,
                    message: 'Something bad happened ' + error
                }));
    }

    onSearchPressed() {
        var query = yelp.request_yelp(this.state.searchString);
        this._executeQuery(query);
        //this._handleResponse(tempJson);
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
                    message: 'GPS unavailable.'
                });
                console.log(error);
            });
    }

    _handleResponse(response) {
        this.setState({ isLoading: false, message: ''});
        if (response.total > 0) {
            this.props.navigator.push({
                title: 'Results',
                component: SearchResults,
                passProps: { results: response.businesses }
            });
        } else {
            this.setState({ message: 'Results not found; please try again.'});
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
        <Image style={styles.container} source={require('./../images/Stray_Dog_Bahamas.png')}>
            <View style={[styles.content, {marginBottom: this.state.keyboardMargin}]}>
                <Text style={styles.bigTitle}>
                  Save a </Text>
                <Text style={styles.bigTitle2}>
                stray
                </Text>
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
                        placeholderTextColor='white'
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
                <Text style={styles.description}>
                Search for rescue shelters by city or zip code
                </Text>
                <Text style={styles.description}>{this.state.message}</Text>
                {spinner}
            </View>
            </Image>
        );
    }
};

var ButtonInputHeight = 46;
var ButtonUnderlayColor = 'rgba(171, 199, 212)';
                
var styles = StyleSheet.create({
    bigTitle: {
        fontSize: 56,
        fontFamily: 'Open Sans',
        textAlign: 'center',
        color: 'white',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 10,
        marginBottom: 0
    },
    bigTitle2: {
        fontFamily: 'Open Sans',
        fontSize: 56,
        textAlign: 'center',
        color: 'white',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 10,
        lineHeight: 50,
        marginBottom: 13
    },
    description: {
        fontFamily: 'Open Sans',
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 6
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
        padding: 30,
        paddingBottom: 0,
        paddingTop: 0,
        backgroundColor: 'rgba(0,0,0,0)',
        flexDirection: 'column',
        alignItems: 'center'
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Open Sans',
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        height: ButtonInputHeight,
        backgroundColor: 'rgba(1,1,1,0.7)',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
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
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'rgba(1,1,1,0.4)',
        borderRadius: 8,
        color: 'white',
        paddingLeft: 15
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
