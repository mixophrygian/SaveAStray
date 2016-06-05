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

let WARNING_MARGIN_TOP = 3;
let WARNING_MARGIN_BOTTOM = 3;
let ADDRESS_MARGIN = 5;
let YELP_INFO_MARGIN_BOTTOM = 0;
let DESCRIPTION_FONT = 12;
let SMALLER_FONT = 12;
let NAME_FONT = 20;

if(height <= 568) {
  //styling defaults for iPhone 4s and 5
};

if(height > 568 && height <= 667) {
  //iphone 6 styles
  YELP_INFO_MARGIN_BOTTOM = 12;
  WARNING_MARGIN_BOTTOM = 20;
  DESCRIPTION_FONT = 14;
  SMALLER_FONT = 14
  NAME_FONT = 23;

};

if(height > 667 && height <= 736) {
  //iphone 6 plus
  YELP_INFO_MARGIN_BOTTOM = 12;
  WARNING_MARGIN_BOTTOM = 20;
  SMALLER_FONT = 14;
  DESCRIPTION_FONT = 16;
  NAME_FONT = 24;

};

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
        width: 83,
        height: 15,
        marginTop: 7,
        marginRight: 3
    }, 
    yelpText: {
        flex: 1,
        flexDirection: 'row',
    },
    yelpText2: {
        flex: 1,
        marginBottom: YELP_INFO_MARGIN_BOTTOM
    },
    yelpLogo: {
        width: 50,
        height: 25,
    },
    staticInfoContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    addressAndNumber: {
        bottom: 0,
        marginTop: ADDRESS_MARGIN,
        marginLeft: 10
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
        marginLeft: 5,
        fontSize: SMALLER_FONT,
        fontFamily: 'Open Sans'
    },
    humaneSocietyURL: {
        color: '#4775B7',
        fontSize: DESCRIPTION_FONT,
        fontFamily: 'Open Sans'
    },
    image: {
        width: width - 20,
        height: (height / 2.7),
        backgroundColor: 'rgba(204,204,204,0.5)'
    },
    textContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 6
    },
    name: {
        fontSize: NAME_FONT,
        lineHeight: NAME_FONT + 2,
        fontFamily: 'Open Sans',
        fontWeight: 'bold',
        color: 'black',
        marginTop: 8,
        marginLeft: 10,
    },
    description: {
        fontSize: DESCRIPTION_FONT,
        fontFamily: 'Open Sans',
        color: '#656565',
        marginBottom: WARNING_MARGIN_BOTTOM,
        marginTop: WARNING_MARGIN_TOP,
        marginLeft: 10
    },
    address: {
        fontSize: SMALLER_FONT,
        fontFamily: 'Open Sans',
        marginTop: 0,
    },
    staticPhone: {
        fontSize: SMALLER_FONT,
        fontFamily: 'Open Sans',
        marginTop: 5,
    },
    phoneUnavailable: {
        fontSize: SMALLER_FONT,
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
        fontSize: SMALLER_FONT,
        fontFamily: 'Open Sans',
        color: '#656565',
        marginTop: 5,
        marginLeft: 3
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
      const url = 'http://saveastrayapp.com/#tips';
      Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }

    callLocation() {
        const phone = this.props.result[0].phone;
        Communications.phonecall(phone, true);
    }

    getDirections() {
      console.log('directions requested');
      const lat = this.props.result[0].location.coordinate.latitude;
      const lon = this.props.result[0].location.coordinate.longitude;
      const url = 'http://maps.apple.com/?q=' + lat +',' + lon;
      Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }

    render() {
        console.log('height: ' + height);
        const result = this.props.result[0];
        console.log(result);
        const reviewCount = result.review_count;
        const reviews = reviewCount + (reviewCount != 1 ? ' Reviews' : ' Review');
        const starsURL = result.rating_img_url_large;
        let name = result.name;
        if(name.length > 50){
          name = name.substring(0,50) + '...';
        };
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
                      style={styles.humaneSocietyURL}
                      underlayColor='white' 
                      onPress={this.viewHumaneSociety.bind(this)}
                      >
                       tips from the humane society </Text>
                     on how to catch a stray. 
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

                      <View style={styles.yelpText}>
                          <Image style={styles.stars} source={{ uri: starsURL }} />
                          <Text style={styles.reviewCount}>{reviews} on </Text>
                          <Image style={styles.yelpLogo} source={{uri: 'yelpLogo', isStatic: true}} />
                      </View>

                      <View style={styles.yelpText2}>
                        <TouchableHighlight
                            underlayColor='white'
                            onPress={this.viewYelp.bind(this)}
                            >
                            <Text style={styles.yelpURLText}>View on Yelp</Text>
                        </TouchableHighlight>
                      </View>

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
