'use strict';

var React = require('react-native');

var { 
    StyleSheet,
    Image,
    TouchableHighlight,
    View,
    Text,
    Component
} = React;

var styles = StyleSheet.create({
    container: {
        marginTop: 65
    },
    heading: {
        backgroundColor: '#F8F8F8',
    },
    stars: {
        width: 84,
        height: 17,
        paddingLeft: 3
    },
    separator: {
        height: 1,
        backgroundColor: '#DDDDDD'
    },
    yelpURLButton: {
    },
    yelpURLText: {
        color: 'blue'
    },
    image: {
        width: 400,
        height: 300
    },
    name: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 5,
        marginLeft: 9,
        color: 'black'
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
        margin: 5,
        color: '#656565'
    }
});

class SingleResult extends Component {
    viewYelp() {
        console.log(this.props.result[0].mobile_url);
    }
    callLocation() {
        console.log(this.props.result[0].phone);
    }
    getDirections() {
    }
    render() {
        var result = this.props.result[0];
        var reviews = result.review_count;
        var starsURL = result.rating_img_url;
        var name = result.name;
        var displayPhone = result.display_phone.slice(3);
        var tempImage = require('./../images/catnose.jpg');
        var picture = result.image_url ? {uri: result.image_url} : tempImage;

        return (
            <View style={styles.container}>
                <Image style={styles.image}
                        source={ picture } />
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
                <Text style={styles.description}>{reviews} Reviews</Text>
                <Image style={styles.stars} source={{ uri: result.rating_img_url }} />
                <Text style={styles.description}>WARNING This result is not confirmed no-kill.  Tap phone number to CALL to verify.</Text>
                <TouchableHighlight
                    style={styles.yelpURLButton}
                    underlayColor='white'
                    onPress={this.viewYelp.bind(this)}
                    >
                    <Text style={styles.yelpURLText}>View on Yelp</Text>
                </TouchableHighlight>
            </View>
        );

    }            
}

module.exports = SingleResult;
