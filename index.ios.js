'use strict'
var React = require('react-native');
var SearchPage = require('./SearchPage');

//the navigationBarHidden thing depends on a change to react-native code: from this.props.navigationBarHidden to route.navigationBarHidden.  Within node_modules/react-native/Libraries/Components/Navigation/NavigatorIOS.ios.js. 

class PetRescue extends React.Component {
    render() {
        return ( 
            <React.NavigatorIOS 
                style={styles.container}
                initialRoute={{
                    title: 'Search',
                    component: SearchPage,
                    navigationBarHidden: true
                }}/>
        );
    }
}

React.AppRegistry.registerComponent('PetRescue', function() { return PetRescue });

var styles = React.StyleSheet.create({
    container: {
        flex: 1
    }
});



