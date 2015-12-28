'use strict';

var React = require('react-native');
var yelp = require('./lib/yelp_api');
var SearchResults = require('./SearchResults');

var {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicatorIOS,
    Image,
    Component
} = React;

class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: '22309',
            isLoading: false,
            message: ''
        };
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
                style={styles.indicator}
                hidden='true'
                size='large'/>) :
            (<View style={styles.spinnerPlaceHolder}/>);
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                   Rescue a lost friend 
                </Text>
               <Image source={require('image!doghelp')} style={styles.image}/>
                {spinner}
                    <View style={styles.flowRight}>
                    <TextInput
                        style={styles.searchInput}
                        value={this.state.searchString}
                        onChange={this.onSearchTextChanged.bind(this)}
                        placeholder='City or zipcode'/>
                    <TouchableHighlight style={styles.button}
                        underlayColor='#99d9f4'>
                        <Text 
                            style={styles.buttonText}
                            onPress={this.onSearchPressed.bind(this)}>Go</Text>
                    </TouchableHighlight>
                </View>
                <TouchableHighlight style={styles.button}
                    underlayColor='#99d9f4'>
                     <Text style={styles.buttonText}>Current Location</Text>
               </TouchableHighlight> 
                <Text style={styles.description}>
                    Search for no-kill shelters by zipcode or current location.
                </Text>
                <Text style={styles.description}>{this.state.message}</Text>
            </View>
        );
    }
};

var ButtonInputHeight = 46;
                
var styles = StyleSheet.create({
    title: {
        fontSize: 38,
        textAlign: 'center',
        color: '#656565'
    },
    description: {
        fontSize: 18,
        textAlign: 'center',
        color: '#656565'
    },
    container: {
        padding: 30,
        marginTop: 45,
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
        height: ButtonInputHeight,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
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
        borderColor: '#48BBEC',
        borderRadius: 8,
        color: 'black',
        paddingLeft: 15
    },
    image: {
        width: 215,
        height: 200,
        margin: 10,
        marginBottom: 40
    },
    spinnerPlaceHolder: {
    },
    indicator: {
    }
});

module.exports = SearchPage;
