'use strict'
var React = require('react-native');
var SearchPage = require('./SearchPage');

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



