'use strict';

var React = require('react-native');
var yelp = require('./../lib/yelp_api');
var SearchResults = require('./SearchResults');
var tempJson = require('./tempJson.json');

var {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicatorIOS,
    Image,
    Component,
    Dimensions
} = React;

class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: 'Minneapolis',
            isLoading: false,
            message: '',
            visibleHeight: Dimensions.get('window').height
        };
    }

    componentWillMount () {
          console.log(this.state.visibleHeight);
    }
    onSearchTextChanged(event) {
        this.setState({ searchString: event.nativeEvent.text });
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
                var search = location.coords.latitude + ',' + location.coords.longitude;
                this.setState({ searchString: search });
                var query = yelp.request_yelp(search);
                this._executeQuery(query);
            },
            error => {
                this.setState({
                    message: 'There was a problem obtaining your location: ' + error
                });
                console.log(error);
            });
    }

    _handleResponse(response) {
        this.setState({ isLoading: false, message: ''});
        if (response.total > 0) {
            this.props.navigator.push({
                title: 'Results',
                tintColor: 'green',
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
            (<View style={styles.spinnerPlaceHolder}/>);
        return (
        <Image style={styles.container} source={require('./../images/Stray_Dog_Bahamas.jpg')}>
            <View style={styles.content}>
                <Text style={styles.bigTitle}>
                  Save a stray 
                </Text>
                    <View style={styles.flowRight}>
                    <TextInput
                        style={styles.searchInput}
                        value={this.state.searchString}
                        onChange={this.onSearchTextChanged.bind(this)}
                        placeholderTextColor='white'
                        placeholder='City or zipcode'/>

                    <TouchableHighlight style={styles.button}
                        underlayColor={ButtonUnderlayColor}>
                        <Text 
                            style={styles.buttonText}
                            onPress={this.onSearchPressed.bind(this)}>Go</Text>
                    </TouchableHighlight>
                </View>
                <TouchableHighlight style={styles.button}
                    underlayColor={ButtonUnderlayColor}
                    onPress={this.onLocationPressed.bind(this)}>
                     <Text style={styles.buttonText}>Current Location</Text>
               </TouchableHighlight> 
                <Text style={styles.description}>
                Search for no-kill shelters by city or zipcode
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
        fontSize: 64,
        textAlign: 'center',
        color: 'white',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 10
    },
    title: {
        fontSize: 48,
        textAlign: 'center',
        color: 'white',
        shadowColor: 'black',
        marginTop: -15,
        marginBottom: 10,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 8
    },
    description: {
        fontSize: 0,
        textAlign: 'center',
        color: 'white',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 4
    },
    container: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    content: {
        padding: 30,
        marginTop:285,
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
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'rgba(1,1,1,0.4)',
        borderRadius: 8,
        color: 'white',
        paddingLeft: 15
    },
    spinnerPlaceHolder: {
    },
    indicator: {
    }
});

module.exports = SearchPage;

               //<Image source={require('image!doghelp')} style={styles.image}/>
