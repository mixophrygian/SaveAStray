'use strict'
import React from 'react-native';
import SearchPage from './app/SearchPage';

//the navigationBarHidden thing depends on a change to react-native code: from this.props.navigationBarHidden to route.navigationBarHidden.  Within node_modules/react-native/Libraries/Components/Navigation/NavigatorIOS.ios.js. 

class StrayRescue extends React.Component {
    render() {
        return ( 
            <React.NavigatorIOS 
                style={styles.container}
                initialRoute={{
                    title: 'Search',
                    component: SearchPage,
                    navigationBarHidden: true
                }}
                tintColor="black"
                />
        );
    }
}

React.AppRegistry.registerComponent('Stray Rescue', function() { return StrayRescue });

const styles = React.StyleSheet.create({
    container: {
        flex: 1
    }
});



