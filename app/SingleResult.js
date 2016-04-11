'use strict';

import React from 'react-native';
import Communications from 'react-native-communications';

import DisplayAddressParser from './../lib/display_address_parser';


const { 
    StyleSheet,
    Image,
    Linking,
    TouchableHighlight,
    Dimensions,
    View,
    Text,
    Component
} = React;

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 65,
        padding: 10,
        backgroundColor:'#F7F7F7'
    },
    allContent: {
        backgroundColor: 'white', 
        width: (width - 20),
        height: (height - 65 - 20)
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
        marginTop: 5
    },
    staticInfoContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    addressAndNumber: {
        bottom: 0,
        marginTop: 5,
    },
    ctaButtonContainer: {
        width: width - 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
    },
    yelpURLText: {
        color:'#4775B7',
        fontSize: 11,
        fontFamily: 'Open Sans'
    },
    image: {
        width: width - 20,
        height: (height / 2.7),
    },
    textContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 6
    },
    name: {
        fontSize: 20,
        fontFamily: 'Open Sans',
        fontWeight: 'bold',
        color: 'black',
        marginTop: 5,
        marginLeft: 10,
        marginBottom: 2
    },
    description: {
        fontSize: 11,
        fontFamily: 'Open Sans',
        color: '#656565',
        marginBottom: 10,
        marginTop: 5
    },
    address: {
        fontSize: 11,
        fontFamily: 'Open Sans',
        marginTop: 0,
    },
    staticPhone: {
        fontSize: 11,
        fontFamily: 'Open Sans',
        marginTop: 5,
    },
    phoneUnavailable: {
        fontSize: 11,
        fontFamily: 'Open Sans',
        marginTop: 5,
        color: 'gray'
    },
    pinGlyph: {
        width: 12,
        height: 12,
        marginRight: 6,
    },
    phoneGlyph: {
        width: 12,
        height: 12,
        marginRight: 6,
        marginTop: 5,
    }, 
    reviewCount: {
        fontSize: 11,
        fontFamily: 'Open Sans',
        color: '#656565',
        marginBottom: 3,
        marginRight: 5
    },
    tapDirections: {
        width: (width / 2) - 10,
        height: 46,
        marginRight: 10,
        paddingTop: 8,
        fontSize: 20,
        fontFamily: 'Open Sans',
        color: 'white',
        backgroundColor: '#6B97D3',
        textAlign: 'center'
    },
    tapDirectionsDisabled: {
        width: (width / 2) - 10,
        marginRight: 10,
        height: 46,
        paddingTop: 8,
        fontSize: 20,
        fontFamily: 'Open Sans',
        color: '#818181',
        backgroundColor: '#DDDCDD',
        textAlign: 'center'
    },
    phoneButton: {            
        width: (width / 2) - 10,
        height: 46,
        paddingTop: 8,
        fontSize: 20,
        fontFamily: 'Open Sans',
        color: 'white',
        backgroundColor: '#2C599C',
        textAlign: 'center',
    },
    phoneButtonDisabled: {
        width: (width / 2) - 10,
        height: 46,
        paddingTop: 8,
        fontSize: 20,
        fontFamily: 'Open Sans',
        backgroundColor: '#A0A0A0',
        color: '#DADADA',
        textAlign: 'center'
    },
    yelpInfo: {
        marginBottom: 0,
    }
});

class SingleResult extends Component {
    viewYelp() {
        const url = this.props.result[0].mobile_url;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }

    viewHumaneSociety() {
      const url = 'http://www.humanesociety.org/animals/resources/tips/what_to_do_stray_pet.html';
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
        console.log('height: ' + height);
        const result = this.props.result[0];
        console.log(result);
        const reviewCount = result.review_count;
        const reviews = reviewCount + (reviewCount != 1 ? ' Reviews' : ' Review');
        const starsURL = result.rating_img_url;
        const name = result.name;
        const displayPhone = result.display_phone ? 
            (<Text style={styles.staticPhone}>{result.display_phone}</Text>)
          : (<Text style={styles.phoneUnavailable}>Phone Number Unavailable</Text>);
         
        const displayAddress = DisplayAddressParser(result.location.display_address);
        const tempImage = { uri: 'catnose', isStatic: true};
        const pinGlyph = { uri: 'Pin', isStatic: true};
        const phoneGlyph = { uri: 'Phone', isStatic: true};
        const phoneNumber = '';
        const phoneButton = result.display_phone ? (<TouchableHighlight
                          underlayColor='white'
                          onPress={this.callLocation.bind(this)}
                          > 
                          <Text style={styles.phoneButton}>Call</Text>
                  </TouchableHighlight>) : 
          (<Text style={styles.phoneButtonDisabled}>Call</Text>);
        const warningBlurb = height > 500 ? (<View> 
                    <Text style={styles.description}>
                    Call to verify hours of business and policies. Check out <Text
                      style={styles.yelpURLText}
                      underlayColor='white' 
                      onPress={this.viewHumaneSociety.bind(this)}
                      >
                       the humane society </Text>
                     for tips on how to catch a stray. 
                    </Text>
                  </View>) : (<View></View>);
        const directions = displayAddress[0].split(',')[0].search(/\d/) >= 0 ? (<TouchableHighlight
            underlayColor='white'
            onPress={this.getDirections.bind(this)}
          >
          <Text style={styles.tapDirections}>
            Directions
          </Text>
          </TouchableHighlight>) : <Text style={styles.tapDirectionsDisabled}>Directions</Text>;
        const picture = result.image_url ? {uri: result.image_url.slice(0,-7) + '/o.jpg' } : tempImage;

        return (
            <View style={styles.container}>
                <View style={styles.allContent}>
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
                      <Text style={styles.reviewCount}>{reviews}</Text>
                      <TouchableHighlight
                          underlayColor='white'
                          onPress={this.viewYelp.bind(this)}
                          >
                          <Text style={styles.yelpURLText}>View on Yelp</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                  {warningBlurb} 
                <View style={styles.addressAndNumber}>
                    <View style={styles.staticInfoContainer}>
                      <Image style={styles.pinGlyph} source={ pinGlyph }/>
                      <Text style={styles.address}>{displayAddress}</Text>
                    </View>
                    <View style={styles.staticInfoContainer}>
                      <Image style={styles.phoneGlyph} source={ phoneGlyph }/>
                      {displayPhone}
                    </View>
                    </View>
                  </View>
                  <View style={styles.ctaButtonContainer}>
                      {phoneButton}
                      {directions}
                  </View>
              </View>
            </View>
        );

    }            
}

module.exports = SingleResult;
