'use strict'
import React, { Component, } from 'react';
import {
  AppRegistry,
  NavigatorIOS,
  StyleSheet
} from 'react-native';

import SearchPage from './app/SearchPage';

//the navigationBarHidden thing depends on a change to react-native code: from this.props.navigationBarHidden to route.navigationBarHidden.  Within node_modules/react-native/Libraries/Components/Navigation/NavigatorIOS.ios.js. 

class StrayRescue extends Component {
    render() {
        return ( 
            <NavigatorIOS 
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

AppRegistry.registerComponent('StrayRescue', ()=> StrayRescue);

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});



