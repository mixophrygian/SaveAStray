'use strict';

import React from 'react-native';
import Communications from 'react-native-communications';

const { 
    StyleSheet,
    Image,
    Linking,
    TouchableHighlight,
    View,
    Text,
    Component
} = React;

const styles = StyleSheet.create({
    container: {
        marginTop: 65
    },
    heading: {
        backgroundColor: 'white',
    },
    stars: {
        width: 84,
        height: 17,
    },
    separator: {
        height: 1,
        backgroundColor: '#DDDDDD'
    },
    yelpText: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 7
    },
    yelpURLButton: {
    },
    yelpURLText: {
        color: 'blue',
        fontSize: 10,
        fontFamily: 'Open Sans'
    },
    image: {
        width: 400,
        height: 250
    },
    textContainer: {
        margin: 10
    },
    name: {
        fontSize: 20,
        fontFamily: 'Open Sans',
        fontWeight: 'bold',
        color: 'black',
        marginTop: 5,
        marginLeft: 10
    },
    phoneText: {
        fontSize: 20,
        fontFamily: 'Open Sans',
        color: 'blue'
    },
    phoneButton: {
        marginLeft: 10,
        marginBottom: 5
    },
    description: {
        fontSize: 18,
        fontFamily: 'Open Sans',
        color: '#656565',
        borderColor: 'purple',
        borderWidth: 1
    },
    address: {
        fontSize: 10,
        fontFamily: 'Open Sans',
        marginTop: 0
    },
    reviewCount: {
        fontSize: 10,
        fontFamily: 'Open Sans',
        color: '#656565',
        marginBottom: 3,
        marginRight: 5
    },
    tapDirections: {
        marginTop: 5,
        fontSize: 20,
        fontFamily: 'Open Sans',
        color: 'blue'
    },
    yelpInfo: {
        marginBottom: 10
    }
});

class SingleResult extends Component {
    viewYelp() {
        const url = this.props.result[0].mobile_url;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }

    callLocation() {
        const phone = this.props.result[0].phone;
        Communications.phonecall(phone, true);
    }

    getDirections() {
      console.log('directions requested');
      var lat = this.props.result[0].location.coordinate.latitude;
      var lon = this.props.result[0].location.coordinate.longitude;
      var url = 'http://maps.apple.com/?q=' + lat +',' + lon;
      Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }

    render() {
        const result = this.props.result[0];
        console.log(result);
        const reviews = result.review_count;
        const starsURL = result.rating_img_url;
        const name = result.name;
        const displayPhone = result.display_phone ? result.display_phone.slice(3) : '';
        const displayAddress = result.location.display_address;
        let address = displayAddress.join('\n');

        //If the area name is redundant with the city name, strip it out.
        switch (displayAddress.length) {
          case 1:
            break;
          case 2:
            if(displayAddress[0] == displayAddress[1].split(',')[0]){
              address = displayAddress[1];
            };
              break;
          case 3:
              if(displayAddress[1] == displayAddress[2].split(',')[0]) {
                address = [displayAddress[0], displayAddress[2]].join('\n');
              };
              break;
          case 4:
              if(displayAddress[2] == displayAddress[3].split(',')[0] ) {
                address = [displayAddress[0], displayAddress[1], displayAddress[3]].join('\n');
              };
            break;
          default:
            break;
         };
        const tempImage = require('./../images/catnose.jpg');
        const directions = displayAddress[0].split(',')[0].search(/\d/) >= 0 ? (<TouchableHighlight
            underlayColor='white'
            onPress={this.getDirections.bind(this)}
          >
          <Text style={styles.tapDirections}>
            Get directions
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
                </View>
                <View style={styles.textContainer}>
                <View style={styles.yelpInfo}>
                    <Image style={styles.stars} source={{ uri: result.rating_img_url }} />

                  <View style={styles.yelpText}>
                    <Text style={styles.reviewCount}>{reviews} Reviews</Text>
                    <TouchableHighlight
                        style={styles.yelpURLButton}
                        underlayColor='white'
                        onPress={this.viewYelp.bind(this)}
                        >
                        <Text style={styles.yelpURLText}>View on Yelp</Text>
                    </TouchableHighlight>
                  </View>
                </View>
                  <Text style={styles.address}>{address}</Text>
                  {directions}
                </View>
                <TouchableHighlight
                        style={styles.phoneButton}
                        underlayColor='white'
                        onPress={this.callLocation.bind(this)}
                        > 
                        <Text style={styles.phoneText}>{displayPhone}</Text>
                </TouchableHighlight>
            </View>
        );

    }            
}

module.exports = SingleResult;
