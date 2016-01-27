'use strict';

import React from 'react-native';
import Communications from 'react-native-communications';

const { 
    StyleSheet,
    Image,
    TouchableHighlight,
    View,
    Text,
    Component,
    LinkingIOS,
    Linking
} = React;

const styles = StyleSheet.create({
    container: {
        marginTop: 65
    },
    heading: {
        backgroundColor: '#F8F8F8',
    },
    stars: {
        width: 84,
        height: 17,
    },
    separator: {
        height: 1,
        backgroundColor: '#DDDDDD'
    },
    yelpURLButton: {
    },
    yelpURLText: {
        color: 'blue',
        marginTop: 10
    },
    image: {
        width: 400,
        height: 250
    },
    textContainer: {
        margin: 10
    },
    name: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 5,
        marginLeft: 10
    },
    phoneText: {
        fontSize: 25,
        color: 'blue'
    },
    phoneButton: {
        marginLeft: 10
    },
    description: {
        fontSize: 18,
        color: '#656565',
        borderColor: 'purple',
        borderWidth: 1
    },
    address: {
        fontSize: 16
    },
    reviewCount: {
        fontSize: 18,
        color: '#656565'
    },
    tapDirections: {
        marginTop: 5,
        fontSize: 16,
        color: 'blue'
    },
    yelpInfo: {
        marginBottom: 10
    }
});

class SingleResult extends Component {
    viewYelp() {
        const url = this.props.result[0].mobile_url;
        LinkingIOS.openURL(url);
    }

    callLocation() {
        const phone = this.props.result[0].phone;
        Communications.phonecall(phone, true);
    }

    getDirections() {
      console.log('tap for directions');
      
    }

    render() {
        const result = this.props.result[0];
        console.log(result);
        const reviews = result.review_count;
        const starsURL = result.rating_img_url;
        const name = result.name;
        const displayPhone = result.display_phone ? result.display_phone.slice(3) : '';
        const address = result.location.display_address.join('\n');
        const tempImage = require('./../images/catnose.jpg');
        const directions = result.location.display_address[0].split(',')[0].search(/\d/) >= 0 ? (<TouchableHighlight
            underlayColor='white'
            onPress={this.getDirections.bind(this)}
          >
          <Text style={styles.tapDirections}>
            (Get directions)
          </Text>
          </TouchableHighlight>) : <Text></Text>;
        const picture = result.image_url ? {uri: result.image_url.slice(0,-7) + '/o.jpg' } : tempImage;

        return (
            <View style={styles.container}>
                <Image style={styles.image}
                        resizeMode='cover'
                        source={ picture } 
                        defaultSource={{ tempImage }} />
                <View style={styles.heading}>
                    <Text style={styles.name}>{name}</Text>
                    <TouchableHighlight
                        style={styles.phoneButton}
                        underlayColor='white'
                        onPress={this.callLocation.bind(this)}
                        > 
                        <Text style={styles.phoneText}>{displayPhone}</Text>
                    </TouchableHighlight>
                    <View style={styles.separator}/>
                </View>
                <View style={styles.textContainer}>
                <View style={styles.yelpInfo}>
                  <Text style={styles.reviewCount}>{reviews} Reviews</Text>
                  <Image style={styles.stars} source={{ uri: result.rating_img_url }} />
                </View>
                  <Text style={styles.address}>{address}</Text>
                  {directions}
                      <TouchableHighlight
                      style={styles.yelpURLButton}
                      underlayColor='white'
                      onPress={this.viewYelp.bind(this)}
                      >
                      <Text style={styles.yelpURLText}>View on Yelp</Text>
                  </TouchableHighlight>
                  </View>
            </View>
        );

    }            
}

module.exports = SingleResult;
