'use strict';

import React, {
    Component,
} from 'react';
import {
    StyleSheet,
    Image,
    Linking,
    TouchableHighlight,
    Dimensions,
    View,
    Text,
} from 'react-native';

import Communications from 'react-native-communications';
import DisplayAddressParser from './../lib/display_address_parser';
import starsImages from './../lib/starsImages';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

let WARNING_MARGIN_TOP = 3;
let WARNING_MARGIN_BOTTOM = 3;
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
  WARNING_MARGIN_BOTTOM = 15;
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
        marginRight: 3
    }, 
    yelpText: {
        flex: 1,
        flexDirection: 'row',
    },
    reviewCount: {
        fontSize: SMALLER_FONT,
        fontFamily: 'Avenir-Medium',
        color: '#656565',
        marginLeft: 3
    },
    yelpText2: {
        flex: 1,
        marginBottom: YELP_INFO_MARGIN_BOTTOM
    },
    yelpLogo: {
        width: 50,
        height: 25,
        marginTop: -7
    },
    staticInfoContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    addressAndNumber: {
        bottom: 0,
        marginLeft: 10,
        //borderWidth: 1,
        //borderColor: 'pink'
    },
    ctaButtonContainer: {
        width: width - 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
    },
    yelpURLText: {
        color:'#325280',
        marginLeft: 2,
        marginTop: 2,
        fontSize: SMALLER_FONT,
        fontFamily: 'Avenir-Medium'
    },
    humaneSocietyURL: {
        color:'#325280',
        textDecorationLine: 'underline',
        fontSize: DESCRIPTION_FONT,
        fontFamily: 'Avenir-Medium'
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
        fontFamily: 'Avenir-Medium',
        fontWeight: 'bold',
        color: 'black',
        marginTop: 8,
        marginLeft: 10,
    },
    description: {
        fontSize: DESCRIPTION_FONT,
        fontFamily: 'Avenir-Medium',
        color: '#656565',
        marginBottom: WARNING_MARGIN_BOTTOM,
        marginTop: WARNING_MARGIN_TOP,
        marginLeft: 10,        
    },
    address: {
        fontSize: SMALLER_FONT,
        fontFamily: 'Avenir-Medium',
        paddingBottom: 3,
        //borderWidth: 1,
        //borderColor: 'red'
    },
    staticPhone: {
        fontSize: SMALLER_FONT,
        fontFamily: 'Avenir-Medium',
        marginTop: 10,
        paddingBottom: 1
        //borderWidth: 1,
        //borderColor: 'blue'
    },
    phoneUnavailable: {
        fontSize: SMALLER_FONT,
        fontFamily: 'Avenir-Medium',
        marginTop: 10,
        color: 'gray',
        //borderWidth: 1,
        //borderColor: 'green'

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
        marginTop: 10,
    }, 
    tapDirections: {
        width: (width / 2) - 10,
        height: 46,
        marginRight: 10,
        paddingTop: 8,
        fontSize: 20,
        fontFamily: 'Avenir-Medium',
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
        fontFamily: 'Avenir-Medium',
        color: '#818181',
        backgroundColor: '#DDDCDD',
        textAlign: 'center'
    },
    phoneButton: {            
        width: (width / 2) - 10,
        height: 46,
        paddingTop: 8,
        fontSize: 20,
        fontFamily: 'Avenir-Medium',
        color: 'white',
        backgroundColor: '#2C599C',
        textAlign: 'center',
    },
    phoneButtonDisabled: {
        width: (width / 2) - 10,
        height: 46,
        paddingTop: 8,
        fontSize: 20,
        fontFamily: 'Avenir-Medium',
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
        const url = this.props.result[0].url;
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
    
    getStarRatingImage(rating) {
      //not a util because 'require' gets weird as an export, and react-native wont let you do dynamic require strings. lame.
      switch(rating) {
        case 0: return require('./../assets/star_0@2x.png')
        case 1: return require('./../assets/star_1@2x.png')
        case 1.5: return require('./../assets/star_1_half@2x.png')
        case 2: return require('./../assets/star_2@2x.png')
        case 2.5: return require('./../assets/star_2_half@2x.png')
        case 3: return require('./../assets/star_3@2x.png')
        case 3.5: return require('./../assets/star_3_half@2x.png')
        case 4: return require('./../assets/star_4@2x.png')
        case 4.5: return require('./../assets/star_4_half@2x.png')
        case 5: return require('./../assets/star_5@2x.png')
        default: return require('./../assets/star_3@2x.png')
      }
    }

    getDirections() {
      
      const lat = this.props.result[0].coordinates.latitude;
      const lon = this.props.result[0].coordinates.longitude;
      const url = 'http://maps.apple.com/?q=' + lat +',' + lon;
      Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }

    render() {
        const result = this.props.result[0];
        const reviewCount = result.review_count;
        const reviews = reviewCount + (reviewCount != 1 ? ' Reviews' : ' Review');
        const starsURL = this.getStarRatingImage(result.rating);
        console.log('starsURL', starsURL);
        let name = result.name;
        if(name.length > 50){
          name = name.substring(0,50) + '...';
        };
        const displayPhone = result.display_phone ? 
            (<Text style={styles.staticPhone}>{result.display_phone}</Text>)
          : (<Text style={styles.phoneUnavailable}>Phone Number Unavailable</Text>);
         
        const displayAddress = DisplayAddressParser(result.location.display_address);
        const tempImage = require('./../assets/catnose.jpg');
        const pinGlyph = require('./../assets/pin.png');
        const phoneGlyph = require('./../assets/phone.png');
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
        const picture = result.image_url ? {uri: result.image_url } : tempImage;

        return (
            <View style={styles.container}>

                <View style={styles.allContent}>
                  <Image style={styles.image}
                          resizeMode='cover'
                          source={ picture } 
                          defaultSource={tempImage} />

                  <View style={styles.heading}>
                      <Text style={styles.name}>{name}</Text>
                  </View>

                  <View style={styles.textContainer}>
                    <View style={styles.yelpInfo}>
                      <View style={styles.yelpText}>
                          <Image style={styles.stars} source={starsURL} />
                          <Text style={styles.reviewCount}>{reviews} on </Text>
                          <Image style={styles.yelpLogo} source={require('./../assets/yelpLogo.png')} />
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
